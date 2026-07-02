-- ============================================
-- 二支博客 数据库建表脚本
-- 数据库: erzhi_blog
-- 字符集: utf8mb4
-- ============================================

CREATE DATABASE IF NOT EXISTS erzhi_blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE erzhi_blog;

-- -------------------------------------------
-- 1. 评论表
-- -------------------------------------------
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '评论ID',
    image_url   VARCHAR(500)  NOT NULL                    COMMENT '头像URL',
    name        VARCHAR(100)  NOT NULL                    COMMENT '昵称',
    comment     TEXT          NOT NULL                    COMMENT '评论内容',
    good        TINYINT(1)    DEFAULT 0                   COMMENT '是否好评: 0=否, 1=是',
    create_time DATETIME      NOT NULL                    COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- -------------------------------------------
-- 2. 用户表
-- -------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id           INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '用户ID',
    name         VARCHAR(100)  NOT NULL UNIQUE             COMMENT '用户名',
    password     VARCHAR(255)  NOT NULL                    COMMENT '密码',
    level        INT           DEFAULT 1                   COMMENT '等级',
    role         INT           DEFAULT 1                   COMMENT '角色: 0=管理员, 1=普通用户',
    avatar       VARCHAR(500)  DEFAULT 'default'           COMMENT '头像标识',
    collect_list JSON          DEFAULT NULL                COMMENT '收藏列表 [{id, collect}]'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -------------------------------------------
-- 3. 书单表
-- -------------------------------------------
DROP TABLE IF EXISTS books;
CREATE TABLE books (
    id           INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '书籍ID',
    name         VARCHAR(200)  NOT NULL                    COMMENT '书名',
    author       VARCHAR(200)  NOT NULL                    COMMENT '作者',
    introduction TEXT                                      COMMENT '简介',
    cover        VARCHAR(500)                              COMMENT '封面URL',
    back_color   VARCHAR(20)   DEFAULT NULL                COMMENT '背景色(hex)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='书单表';

-- -------------------------------------------
-- 4. Vue 面经题目表
-- -------------------------------------------
DROP TABLE IF EXISTS vue_questions;
CREATE TABLE vue_questions (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '题目ID',
    title       VARCHAR(500)  NOT NULL                    COMMENT '题目标题',
    content     LONGTEXT      NOT NULL                    COMMENT 'HTML答案内容',
    create_time BIGINT        NOT NULL                    COMMENT 'Unix毫秒时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Vue面经题目表';

-- -------------------------------------------
-- 5. UniApp 面经题目表
-- -------------------------------------------
DROP TABLE IF EXISTS uniapp_questions;
CREATE TABLE uniapp_questions (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '题目ID',
    title       VARCHAR(500)  NOT NULL                    COMMENT '题目标题',
    content     LONGTEXT      NOT NULL                    COMMENT 'HTML答案内容',
    create_time BIGINT        NOT NULL                    COMMENT 'Unix毫秒时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='UniApp面经题目表';

-- -------------------------------------------
-- 6. React 面经题目表
-- -------------------------------------------
DROP TABLE IF EXISTS react_questions;
CREATE TABLE react_questions (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '题目ID',
    title       VARCHAR(500)  NOT NULL                    COMMENT '题目标题',
    content     LONGTEXT      NOT NULL                    COMMENT 'HTML答案内容',
    create_time BIGINT        NOT NULL                    COMMENT 'Unix毫秒时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='React面经题目表';

-- -------------------------------------------
-- 7. 微信小程序面经题目表
-- -------------------------------------------
DROP TABLE IF EXISTS wxapp_questions;
CREATE TABLE wxapp_questions (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '题目ID',
    title       VARCHAR(500)  NOT NULL                    COMMENT '题目标题',
    content     LONGTEXT      NOT NULL                    COMMENT 'HTML答案内容',
    create_time BIGINT        NOT NULL                    COMMENT 'Unix毫秒时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='微信小程序面经题目表';

-- -------------------------------------------
-- 8. 资源分类表
-- -------------------------------------------
DROP TABLE IF EXISTS resource_headers;
CREATE TABLE resource_headers (
    id    INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '分类ID',
    name  VARCHAR(100)  NOT NULL                    COMMENT '分类名称',
    color VARCHAR(20)   NOT NULL                    COMMENT '颜色(hex)',
    label INT           NOT NULL                    COMMENT '排序标签'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源分类表';

-- -------------------------------------------
-- 9. 资源卡片表
-- -------------------------------------------
DROP TABLE IF EXISTS resource_cards;
CREATE TABLE resource_cards (
    id          INT           PRIMARY KEY AUTO_INCREMENT  COMMENT '卡片ID',
    label       INT           NOT NULL                    COMMENT '关联 resource_headers.label',
    name        VARCHAR(200)  NOT NULL                    COMMENT '资源名称',
    description TEXT                                      COMMENT '简介',
    content     LONGTEXT                                  COMMENT '详细HTML',
    icon        VARCHAR(500)                              COMMENT '图标URL',
    url         VARCHAR(500)  DEFAULT NULL                COMMENT '外部链接',
    versions    JSON          DEFAULT NULL                COMMENT '版本数组 [{label, url}]',
    copy_text   LONGTEXT      DEFAULT NULL                COMMENT '可复制文本'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='资源卡片表';
