//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2019. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information. 
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here. 
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("FILE_BLOB")
public class FileBlobDTO {
  // =============================================================================================================================
  // public
  // =============================================================================================================================
    public FileBlobDTO() {}
    
    public FileBlobDTO(@JsonProperty(value = "content", required=true) String content) {
      this.content = content;
    }
    
    public String getContent() {
      return content;
    }
    
    public void setContent(String content) {
      this.content = content;
    }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================
    
    
  // =============================================================================================================================
  // private
  // =============================================================================================================================
  private String content;
}
