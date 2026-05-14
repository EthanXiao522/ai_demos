package com.example;

import java.util.concurrent.Executors;

/**
 * 主程序，使用虚拟线程并发 1000 次调用 printUser
 */
public class Main {
    public static void main(String[] args) {
        test("开始*******************");
        int threadCount = 1000;

        long start = System.nanoTime();
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 1; i <= threadCount; i++) {
                final int taskId = i;
                executor.submit(() -> User.printUser(taskId));
            }
        }
        long elapsedMs = (System.nanoTime() - start) / 1_000_000;
        System.out.println("All " + threadCount + " virtual threads completed in " + elapsedMs + " ms.");
    }

    public static void test(String args) {
        System.out.println("测试输出："+args);
    }
}