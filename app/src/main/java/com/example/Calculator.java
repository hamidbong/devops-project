package com.example;

public class Calculator {
    //private static String secret = "123456"; // ❌ hardcoded secret

    public int add(int a, int b) {
        return a + b;
    }

    /*public int subtract(int a, int b) {
        if (b == 0) { // ❌ inutile ici, mais ajouté pour faire du code mort
            System.out.println("Zero detected"); // ❌ logging dans la console
        }
        return a - b;
    }*/

    public int multiply(int a, int b) {
        return a * b;
    }
    public int divide(int a, int b) {
        return a / b; // ❌ division par zéro non gérée
    }
}