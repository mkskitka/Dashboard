//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2014. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.dto;

import static javax.xml.bind.annotation.XmlAccessType.FIELD;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author Dominic Anello (danello@cra.com)
 */
@XmlRootElement
@XmlAccessorType(FIELD)
public class ExampleSubDTO {
  // =============================================================================================================================
  // public
  // =============================================================================================================================

  public ExampleSubDTO(String... v) {
    this.values.addAll(Arrays.asList(v));
  }

  public List<String> getValues() {
    return this.values;
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  public ExampleSubDTO() {
    // noop
  }

  // =============================================================================================================================
  // private
  // =============================================================================================================================

  @XmlElement(name = "values", required = true, nillable = false)
  private List<String> values = new ArrayList<>();
}
