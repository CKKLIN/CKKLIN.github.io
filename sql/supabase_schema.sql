-- ============================================
-- 二支博客 Supabase (PostgreSQL) 建表脚本
-- 在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 评论表
CREATE TABLE IF NOT EXISTS comments (
    id          SERIAL PRIMARY KEY,
    image_url   VARCHAR(500) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    comment     TEXT         NOT NULL,
    good        SMALLINT     DEFAULT 0,
    create_time TIMESTAMP    NOT NULL
);

-- 2. 用户表
CREATE TABLE IF NOT EXISTS users (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    level        INT          DEFAULT 1,
    role         INT          DEFAULT 1,
    avatar       VARCHAR(500) DEFAULT 'default',
    collect_list JSONB        DEFAULT NULL
);

-- 3. 书单表
CREATE TABLE IF NOT EXISTS books (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(200) NOT NULL,
    author       VARCHAR(200) NOT NULL,
    introduction TEXT,
    cover        VARCHAR(500),
    back_color   VARCHAR(20)
);

-- 4. Vue 面经
CREATE TABLE IF NOT EXISTS vue_questions (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    content     TEXT         NOT NULL,
    create_time BIGINT       NOT NULL
);

-- 5. UniApp 面经
CREATE TABLE IF NOT EXISTS uniapp_questions (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    content     TEXT         NOT NULL,
    create_time BIGINT       NOT NULL
);

-- 6. React 面经
CREATE TABLE IF NOT EXISTS react_questions (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    content     TEXT         NOT NULL,
    create_time BIGINT       NOT NULL
);

-- 7. 微信小程序面经
CREATE TABLE IF NOT EXISTS wxapp_questions (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(500) NOT NULL,
    content     TEXT         NOT NULL,
    create_time BIGINT       NOT NULL
);

-- 8. 资源分类
CREATE TABLE IF NOT EXISTS resource_headers (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    color VARCHAR(20)  NOT NULL,
    label INT          NOT NULL
);

-- 9. 资源卡片
CREATE TABLE IF NOT EXISTS resource_cards (
    id          SERIAL PRIMARY KEY,
    label       INT  NOT NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    content     TEXT,
    icon        VARCHAR(500),
    url         VARCHAR(500),
    versions    JSONB,
    copy_text   TEXT
);

-- 启用 RLS (Row Level Security) 但允许公开读取
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE vue_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE uniapp_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE react_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wxapp_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_cards ENABLE ROW LEVEL SECURITY;

-- 公开可读
CREATE POLICY "public_read" ON comments FOR SELECT USING (true);
CREATE POLICY "public_read" ON users FOR SELECT USING (true);
CREATE POLICY "public_read" ON books FOR SELECT USING (true);
CREATE POLICY "public_read" ON vue_questions FOR SELECT USING (true);
CREATE POLICY "public_read" ON uniapp_questions FOR SELECT USING (true);
CREATE POLICY "public_read" ON react_questions FOR SELECT USING (true);
CREATE POLICY "public_read" ON wxapp_questions FOR SELECT USING (true);
CREATE POLICY "public_read" ON resource_headers FOR SELECT USING (true);
CREATE POLICY "public_read" ON resource_cards FOR SELECT USING (true);

-- 公开可写 (评论、用户注册/更新)
CREATE POLICY "public_insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON comments FOR UPDATE USING (true);
CREATE POLICY "public_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON users FOR UPDATE USING (true);
