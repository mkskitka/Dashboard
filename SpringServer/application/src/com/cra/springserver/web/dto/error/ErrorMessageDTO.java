//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.dto.error;

import static javax.xml.bind.annotation.XmlAccessType.FIELD;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@XmlAccessorType(FIELD)
public class ErrorMessageDTO {
  // =============================================================================================================================
  // public
  // =============================================================================================================================
  public ErrorMessageDTO(ErrorMessageType type) {
    this.type = type;
  }

  public ErrorMessageDTO(ErrorMessageType type, String message) {
    this(type);
    this.messages.add(message);
  }

  public ErrorMessageType getType() {
    return this.type;
  }

  public List<String> getMessages() {
    return this.messages;
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================
  protected ErrorMessageDTO() {
    // noop
  }

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  @XmlElement(name = "type", nillable = false, required = true)
  private ErrorMessageType type = ErrorMessageType.UNKNOWN_ERROR;

  @XmlElement(name = "messages", nillable = true, required = true)
  private final List<String> messages = new ArrayList<>();
}
