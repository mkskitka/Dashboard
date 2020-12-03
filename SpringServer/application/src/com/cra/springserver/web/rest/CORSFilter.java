/*******************************************************************************
 * Charles River Analytics, Inc., Cambridge, Massachusetts
 * Copyright (C) 2016. All Rights Reserved.
 * See http://www.cra.com or email info@cra.com for information.
 ******************************************************************************/
package com.cra.springserver.web.rest;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class CORSFilter {
  /** 
   * Returns an HTTP response with CORS headers given an object to send
   * @param <T>
   */

  public static <T> ResponseEntity<T> filter(T toSend, HttpStatus code) {
    return ResponseEntity
        .status(code)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
        .body(toSend);
  }

  public static <T> ResponseEntity<T> filter(T toSend, HttpHeaders headers) {
    if (headers != null) {
      headers.add("Access-Control-Allow-Origin", "*");
      headers.add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    }
    return new ResponseEntity<>(toSend, headers, HttpStatus.OK);
  }

  public static <T> ResponseEntity<T> filterError(T toSend, HttpHeaders headers, HttpStatus status) {
    if (headers != null) {
      headers.add("Access-Control-Allow-Origin", "*");
      headers.add("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    }
    return new ResponseEntity<>(toSend, headers, status);
  }

  public static ResponseEntity<String> filterError(String message, int errorCode) {
    return ResponseEntity
        //.status(HttpStatus.NOT_FOUND)
        .status(errorCode)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
        .body(message);
  }
}
