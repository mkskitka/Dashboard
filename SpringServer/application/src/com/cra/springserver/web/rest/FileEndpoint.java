//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2019. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information. 
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here. 
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.rest;

import java.io.*;
import java.lang.reflect.Array;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.stream.Stream;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import java.util.List;
import java.util.ArrayList;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.stream.Collectors;

@RestController
@RequestMapping("file")
public class FileEndpoint {
    String COMMA_DELIMITER = ",";
  // =============================================================================================================================
  // public
  // =============================================================================================================================
  /**
   * Web service to read content from file.
   * 
   * @param filename
   * @return
   */

  String ROOT_DATA_DIR = "C://ALPACA_DATA//data//";
  //String ROOT_DATA_DIR = "//media//data1//Y1_Evaluation//airsim_generated//";
  String VARS_SUB_DIR_2 = "//candidate_vars//";

  @RequestMapping(method=GET, path="import", produces = "text/plain")
  public ResponseEntity<String> importFile(
      @RequestParam(value = "filename") String filename) {
    
    // Look for a file in "Temp" directory.
    // The path is dependent on the operating system environment variable
    // for which it was setup.
    String content = "";
    Path path = Paths.get((ROOT_DATA_DIR).concat(filename));
    String pathStr = (ROOT_DATA_DIR).concat(filename);
    List<List<String>> records = new ArrayList<>();
    try (BufferedReader br = new BufferedReader(new FileReader(pathStr))) {

        //GET HEADING
        String line = br.readLine();
        String[] values = line.split(COMMA_DELIMITER);
        String[] arr = Arrays.copyOf(values, values.length + 1);
        arr[arr.length-1] =  "implicit_vars";
        records.add(Arrays.asList(arr));

        while ((line = br.readLine()) != null) {
            values = line.split(COMMA_DELIMITER);
            String path_to_vars = getPathToImplicitVars(values);
            String implicit_vars = new String(Files.readAllBytes(Paths.get(path_to_vars)), StandardCharsets.UTF_8);
            arr = Arrays.copyOf(values, values.length + 1);
            arr[arr.length-1] =  implicit_vars;
            records.add(Arrays.asList(arr));
        }
        Gson gson = new Gson();
        content = gson.toJson(records);

    }
    catch (IOException e) {
        e.printStackTrace();
        return CORSFilter.filterError("Unable to read file", HttpStatus.INTERNAL_SERVER_ERROR.value());
    }
    return CORSFilter.filter(content, HttpStatus.OK);
  }

  private String getPathToImplicitVars(String[] values) {
      String path_ = values[3].replaceAll("\\s+","");
      String id_ = values[4].substring(2).replaceAll("\\s+","");
      String path_to_vars = ROOT_DATA_DIR + path_ + VARS_SUB_DIR_2 + id_ + ".json";
      return path_to_vars;
  }
  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  @SuppressWarnings("resource")
  private String readFile(String filePath) throws IOException
  {
      StringBuilder contentBuilder = new StringBuilder();
      Stream<String> stream = Files.lines( Paths.get(filePath), StandardCharsets.UTF_8);
      stream.forEach(s -> contentBuilder.append(s).append("\n"));
      return contentBuilder.toString();
  }
  private static final Logger LOG = LoggerFactory.getLogger(FileEndpoint.class);
}
