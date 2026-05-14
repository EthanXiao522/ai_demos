package com.example;

import java.util.UUID;

/**
 * 简化后的用户模型，使用 record 减少样板代码
 */
public record User(int id, String name) {
    /**
     * 构建并打印 User 对象
     */
    public static void printUser(int i) {
        String randomName = UUID.randomUUID().toString().substring(0, 8);
        User user = new User(i, randomName);
        System.out.println("[Thread: " + Thread.currentThread().getName()
                + ", isVirtual=" + Thread.currentThread().isVirtual()
                + "] " + user);
    }
}