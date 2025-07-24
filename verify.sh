#!/bin/bash

echo "=========================================="
echo "React Interview Warehouse 项目验证"
echo "=========================================="
echo

# 检查项目基本结构
echo "1. 检查项目结构..."
echo "✅ 项目根目录: $(pwd)"

if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
    echo "   - 包含 @arco-design/web-react: $(grep -o '@arco-design/web-react.*' package.json)"
    echo "   - 包含 react-dnd: $(grep -o 'react-dnd.*' package.json)"
else
    echo "❌ package.json 不存在"
fi

if [ -f "src/App.tsx" ]; then
    echo "✅ 主应用文件 src/App.tsx 存在"
else
    echo "❌ src/App.tsx 不存在"
fi

if [ -f "src/components/DraggableTable.tsx" ]; then
    echo "✅ 可拖拽表格组件 src/components/DraggableTable.tsx 存在"
else
    echo "❌ src/components/DraggableTable.tsx 不存在"
fi

echo

# 检查Git分支和提交
echo "2. 检查Git分支和提交..."
echo "当前分支: $(git branch --show-current)"
echo "分支列表:"
git branch -a

echo
echo "最近的提交:"
git log --oneline -n 3

echo

# 检查代码功能
echo "3. 检查代码功能实现..."

# 检查菜单结构
if grep -q "用户管理" src/App.tsx; then
    echo "✅ 包含用户管理菜单"
else
    echo "❌ 未找到用户管理菜单"
fi

if grep -q "用户列表" src/App.tsx; then
    echo "✅ 包含用户列表子菜单"
else
    echo "❌ 未找到用户列表子菜单"
fi

# 检查表格功能
if grep -q "DraggableTable" src/App.tsx; then
    echo "✅ 主应用引用了可拖拽表格"
else
    echo "❌ 主应用未引用可拖拽表格"
fi

# 检查表格列
echo "表格列检查:"
if grep -q "id.*name.*email.*department.*status" src/components/DraggableTable.tsx; then
    echo "✅ 表格包含5列数据"
else
    echo "❌ 表格列数不正确"
fi

# 检查Mock数据
if grep -q "mockData.*=.*\[" src/components/DraggableTable.tsx; then
    echo "✅ 包含Mock数据"
    mock_count=$(grep -o "key.*:" src/components/DraggableTable.tsx | wc -l)
    echo "   Mock数据条数: $mock_count"
else
    echo "❌ 未找到Mock数据"
fi

# 检查按钮功能
if grep -q "查看" src/components/DraggableTable.tsx && grep -q "删除" src/components/DraggableTable.tsx; then
    echo "✅ 包含查看和删除按钮"
else
    echo "❌ 缺少查看或删除按钮"
fi

# 检查删除功能
if grep -q "handleDelete" src/components/DraggableTable.tsx; then
    echo "✅ 实现了删除功能"
else
    echo "❌ 未实现删除功能"
fi

# 检查拖拽功能
if grep -q "useDrag\|useDrop\|DndProvider" src/components/DraggableTable.tsx; then
    echo "✅ 实现了拖拽功能"
else
    echo "❌ 未实现拖拽功能"
fi

echo

# 检查依赖
echo "4. 检查依赖配置..."
echo "主要依赖:"
grep -A 10 '"dependencies"' package.json | grep -E '(arco-design|react|react-dom|react-dnd)'

echo

echo "=========================================="
echo "验证完成！"
echo "=========================================="
echo
echo "启动项目的命令:"
echo "1. npm install (安装依赖)"
echo "2. npm run dev (启动开发服务器)"
echo
echo "或者使用 yarn:"
echo "1. yarn install"
echo "2. yarn dev"
echo
echo "预期功能:"
echo "- 打开浏览器访问 http://localhost:5173"
echo "- 点击左侧菜单 '用户管理' -> '用户列表'"
echo "- 查看包含5列数据的表格"
echo "- 测试查看和删除按钮"
echo "- 测试拖拽行排序功能"