package com.cra.springserver.utils;

import com.sun.prism.shader.AlphaOne_Color_AlphaTest_Loader;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.stream.Collectors;

public class URLUtils {
	/**
	 * Get absolute path to the given file name contained in the
	 * resources directory.
	 *
	 * @param fileName The name of the file for which the path is returned
	 * @return
	 */
	public static String ResourceFilePath(String fileName) {
		final URL location = URLUtils.class.getClassLoader().getResource(fileName.trim());
		if (location == null)
			return null;

		String filePath = location.getPath().toString();
		// Remove the first "/"
		filePath = filePath.substring(1, filePath.length());
		return filePath;
	}

	/**
	 * Read the content of the file, specified by the given name, into a String object
	 *
	 * @param fileName  The name of the file to read
	 * @return
	 */
	public static String ResourceFileContent(String fileName) {
		final URL location = URLUtils.class.getClassLoader().getResource(fileName.trim());
		if (location == null)
			return null;

		String result = null;
		try {
			InputStream is = location.openStream();
			BufferedReader reader = new BufferedReader(( new InputStreamReader(is)));
			result = reader.lines().collect(Collectors.joining(System.lineSeparator()));
			is.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

	    return result;
	}
}
