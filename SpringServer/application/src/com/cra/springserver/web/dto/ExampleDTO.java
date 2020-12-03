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
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import com.cra.springserver.service.CrudService;
import com.cra.springserver.model.Example;

/**
 * This is an example Data Transfer Object. When returned or accepted by an endpoint, it will automatically get converted to/from
 * JSON or XML depending on the content type. By placing JAXB annotations on this object, we can control what we expose over the
 * endpoint. Non-annotated fields will not be serialized, nor will they be initialized when being deserialized.
 *
 * Note that it is possible to place JAXB annotations on model objects directly which elides the necessity to have DTOs.
 *
 * @author Dominic Anello (danello@cra.com)
 */
@XmlRootElement
@XmlAccessorType(FIELD)
public class ExampleDTO {
  // =============================================================================================================================
  // public
  // =============================================================================================================================

  public ExampleDTO(String a, String b) {
    this.propertyA = a;
    this.propertyB = b;
  }

  public ExampleDTO(Example ex) {
    this.propertyA = ex.getA();
    this.propertyB = ex.getB();
    this.id = ex.getId();
  }

  /**
   * Assemble
   *
   * @param crudSvc
   * @return
   */
  public Example assemble(CrudService crudSvc) {
    final Example ex;
    if (this.id != null) {
      ex = crudSvc.retrieveById(Example.class, this.id);
      // if ID is set, but we couldn't load from the DB, then we can perform
      // the assembly
      if (ex == null) {
        return null;
      }
    } else {
      ex = new Example(this.propertyA);
    }

    // update model with values from the DTO
    ex.setA(this.propertyA);
    ex.setB(this.propertyB);

    // save the changes and return the result
    return crudSvc.update(ex);
  }

  public String getPropertyA() {
    return this.propertyA;
  }

  public void setPropertyA(String propertyA) {
    this.propertyA = propertyA;
  }

  public String getPropertyB() {
    return this.propertyB;
  }

  public void setPropertyB(String propertyB) {
    this.propertyB = propertyB;
  }

  public ExampleSubDTO getValues() {
    return this.values;
  }

  public void setValues(ExampleSubDTO values) {
    this.values = values;
  }

  public Long getId() {
    return this.id;
  }

  @Override
  public String toString() {
    if (this.allProperties == null) {
      this.allProperties = "<(ExampleDTO) id=" + this.id + "; a=" + this.propertyA + "; b=" + this.propertyB + "; subElement="
          + this.values + ">";
    }
    return this.allProperties;
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  /**
   * DTOs always need a no-arg constructor so they can be initialized empty and filled with deserialized data by the endpoint.
   */
  protected ExampleDTO() {
    // noop
  }

  // =============================================================================================================================
  // private
  // =============================================================================================================================

  // An example of a manditory element that may be null
  //
  // Making elements required makes for a more consistent API as it means the item will always be present in the JSON, even if it
  // is null. However, it also means if callers to your endpoint ommit the element when performing a POST or PUT, the input will
  // fail to parse, so it is a tradeoff between consistency and flexibility.
  @XmlElement(name = "id", nillable = true, required = true)
  private Long id = null;

  // an example of an element that *must* be present and non-null
  @XmlElement(name = "a", nillable = false, required = true)
  private String propertyA = null;

  // an example of an optional element that may be omitted.
  @XmlElement(name = "b", nillable = true, required = false)
  private String propertyB = null;

  // DTOs may be nested
  @XmlElement(name = "sub_component", nillable = false, required = true)
  private ExampleSubDTO values = null;

  // This field will not appear when serialized over an endpoint because it doesn't have a JAXB annotation.
  private transient String allProperties = null;
}
