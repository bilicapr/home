#!/bin/bash

# --- 自动磁盘格式化与配置脚本 (yp.sh) ---

echo "--- 磁盘格式化与配置脚本 (by Gemini) ---"
echo ""

# 1. 列出所有磁盘并提示用户选择
echo "🔎 正在检测系统中的块设备..."
echo "---"
echo "设备列表 (请留意没有分区的磁盘，如 vdb):"
# 使用 lsblk 列出所有磁盘和分区，并计算已用空间比例
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE | grep -E 'disk|part'
echo "---"

# 询问用户选择哪个磁盘
read -p "请输入要格式化和分区的磁盘设备（例如 /dev/vdb）: " DISK

# 检查输入是否有效
if [[ -z "$DISK" ]]; then
    echo "错误：未输入磁盘设备。"
    exit 1
fi

if [[ ! -b "$DISK" ]]; then
    echo "错误：设备 $DISK 不存在或不是块设备。"
    exit 1
fi

# 确认操作
echo ""
DISK_SIZE=$(lsblk -ndb --output SIZE "$DISK" 2>/dev/null | awk '{print $1 / 1024 / 1024 / 1024}')
echo "✅ 目标磁盘：$DISK (总大小: ${DISK_SIZE:0:5} GB)"
echo "⚠️ 警告：继续操作将销毁 $DISK 上的所有数据！"
read -r -p "再次确认要格式化 $DISK 吗？请输入 YES 确认: " confirmation
if [[ "$confirmation" != "YES" ]]; then
    echo "操作已取消。"
    exit 0
fi
echo ""

# 设置分区和文件系统类型
PARTITION="${DISK}1"
FS_TYPE="ext4"

# 2. 询问用户挂载点
read -p "请输入挂载点目录（例如 /opt），按回车默认为 /opt: " MOUNT_POINT
if [[ -z "$MOUNT_POINT" ]]; then
    MOUNT_POINT="/opt"
fi
echo "🎯 确认挂载点为: $MOUNT_POINT"
echo ""

# 3. 预处理与分区
echo ">> 尝试卸载并刷新分区表..."
sudo umount "$DISK"* 2>/dev/null
sudo blockdev --rereadpt "$DISK" 2>/dev/null

echo ">> 正在使用 gdisk 创建 GPT 单个分区 ($PARTITION)..."
# 使用 Here-String 自动输入 gdisk 命令：o, y, n, 默认, 默认, 默认, w, y
if ! sudo gdisk "$DISK" <<< $'\no\ny\nn\n\n\n\n\nw\ny' > /dev/null; then
    echo "分区失败，请手动检查 gdisk 是否安装或运行。"
    exit 1
fi

# 4. 再次刷新分区表
echo ">> 再次刷新分区表以识别 ${PARTITION}..."
sudo blockdev --rereadpt "$DISK"

# 检查分区设备文件是否创建
if [[ ! -b "$PARTITION" ]]; then
    echo "错误：分区设备 ${PARTITION} 未创建成功。请手动检查！"
    exit 1
fi

# 5. 格式化
echo ">> 正在格式化 ${PARTITION} 为 ${FS_TYPE}..."
if ! sudo mkfs."$FS_TYPE" -F "$PARTITION"; then
    echo "格式化失败，请手动检查 mkfs.$FS_TYPE 是否可用。"
    exit 1
fi

# 6. 获取 UUID 并输出 fstab 配置
UUID=$(sudo blkid -s UUID -o value "$PARTITION")
if [[ -z "$UUID" ]]; then
    echo "错误：无法获取 ${PARTITION} 的 UUID。"
    exit 1
fi

echo ""
echo "========================================================"
echo "✅ 成功！分区 ${PARTITION} 已格式化。"
echo ""
echo "请执行以下步骤完成挂载："
echo ""
echo "1. 创建挂载点目录（如果不存在）："
echo "   sudo mkdir -p ${MOUNT_POINT}"
echo ""
echo "2. 将以下行复制粘贴到 /etc/fstab 文件中："
echo "   (打开文件: sudo nano /etc/fstab)"
echo ""
echo "   ${UUID}    ${MOUNT_POINT}    ${FS_TYPE}    defaults    0    2"
echo ""
echo "3. 立即测试挂载，并使配置生效："
echo "   sudo mount -a"
echo "========================================================"
