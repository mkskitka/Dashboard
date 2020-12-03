package com.cra.springserver.utils;

public class StringUtils {
	public static boolean isStringUpperCase(String str) {

		return str.matches("[A-Z0-9\\_\\-]*");
	}
}