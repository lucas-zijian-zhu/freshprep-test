# Docker 使用指南

本项目支持完整的 Docker 容器化开发和生产部署。

## 🐳 Docker 配置概览

### 文件结构
```
├── Dockerfile          # 生产环境多阶段构建
├── Dockerfile.dev      # 开发环境构建
├── docker-compose.yml  # 服务编排配置
├── .dockerignore       # Docker 忽略文件
└── DOCKER.md          # 本指南
```

## 🚀 快速开始

### 1. 启动 Docker Desktop
确保 Docker Desktop 正在运行：
```bash
# 检查 Docker 状态
docker --version
docker-compose --version
```

### 2. 开发环境
```bash
# 启动开发环境（推荐）
npm run docker:dev

# 或者分步执行
npm run docker:build-dev
npm run docker:run-dev
```

### 3. 生产环境
```bash
# 构建并启动生产环境
npm run docker:prod

# 或者分步执行
npm run docker:build-prod
npm run docker:run-prod
```

## 📱 访问应用

### 开发环境端口
- **Metro Bundler**: http://localhost:8081
- **Expo Dev Tools**: http://localhost:19000
- **Expo Dev Server**: http://localhost:19001
- **Expo Tunnel**: http://localhost:19002

### 生产环境端口
- **应用服务**: http://localhost:8081

## 🛠️ 可用命令

### 开发命令
```bash
# 启动开发环境
npm run docker:dev

# 构建开发镜像
npm run docker:build-dev

# 运行开发容器
npm run docker:run-dev

# 查看开发日志
npm run docker:logs
```

### 生产命令
```bash
# 启动生产环境
npm run docker:prod

# 构建生产镜像
npm run docker:build-prod

# 运行生产容器
npm run docker:run-prod
```

### 管理命令
```bash
# 构建所有镜像
npm run docker:build

# 清理容器和镜像
npm run docker:clean

# 查看容器日志
npm run docker:logs
```

## 🔧 配置说明

### 开发环境特性
- **热重载**: 代码更改自动重新加载
- **卷挂载**: 本地代码同步到容器
- **多端口**: 支持所有 Expo 开发工具
- **环境变量**: 自动配置网络访问

### 生产环境特性
- **多阶段构建**: 优化镜像大小
- **非 root 用户**: 安全运行
- **最小依赖**: 只包含运行时必需文件
- **性能优化**: 针对生产环境调优

## 📋 环境变量

### 开发环境
```bash
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0
```

### 生产环境
```bash
NODE_ENV=production
```

## 🐛 故障排除

### 常见问题

#### 1. Docker 守护进程未运行
```bash
# 错误: Cannot connect to the Docker daemon
# 解决: 启动 Docker Desktop
```

#### 2. 端口被占用
```bash
# 错误: Port already in use
# 解决: 停止占用端口的进程或更改端口配置
```

#### 3. 权限问题
```bash
# 错误: Permission denied
# 解决: 确保 Docker 有足够权限访问项目目录
```

#### 4. 网络连接问题
```bash
# 错误: Network unreachable
# 解决: 检查防火墙设置和网络配置
```

### 调试命令
```bash
# 查看容器状态
docker ps -a

# 查看容器日志
docker logs <container_id>

# 进入容器调试
docker exec -it <container_id> /bin/bash

# 查看镜像
docker images

# 清理系统
docker system prune -a
```

## 🔄 开发工作流

### 1. 首次设置
```bash
# 克隆项目
git clone <repository-url>
cd freshprep-test

# 启动 Docker 开发环境
npm run docker:dev
```

### 2. 日常开发
```bash
# 启动开发环境
npm run docker:dev

# 在另一个终端查看日志
npm run docker:logs

# 停止环境
docker-compose down
```

### 3. 生产部署
```bash
# 构建生产镜像
npm run docker:build-prod

# 运行生产容器
npm run docker:run-prod
```

## 📊 性能优化

### 镜像大小优化
- 使用 Alpine Linux 基础镜像
- 多阶段构建减少最终镜像大小
- 排除不必要的文件和依赖

### 构建速度优化
- 利用 Docker 层缓存
- 合理使用 .dockerignore
- 并行构建多个服务

### 运行时优化
- 非 root 用户运行
- 最小化运行时依赖
- 优化内存使用

## 🔒 安全考虑

### 容器安全
- 使用非 root 用户运行应用
- 最小化攻击面
- 定期更新基础镜像

### 网络安全
- 只暴露必要端口
- 使用内部网络通信
- 配置适当的防火墙规则

## 📚 更多资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Expo Docker 指南](https://docs.expo.dev/guides/using-docker/)
- [React Native Docker 最佳实践](https://reactnative.dev/docs/environment-setup)

## 🤝 贡献

如果你发现 Docker 配置的问题或有改进建议，请：
1. 创建 Issue 描述问题
2. 提交 Pull Request 提供修复
3. 更新相关文档

---

**注意**: 确保在修改 Docker 配置后重新构建镜像以应用更改。
