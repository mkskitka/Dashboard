//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * An example hibernate model object.
 *
 * @author danello
 */
// mark this object as a hibernate entity
@Entity
// the able that this entity maps to
@Table(name = "example")
public class Example extends DefaultModelObject {
  // =============================================================================================================================
  // public
  // =============================================================================================================================

  // it's good practice to requ
  public Example(String a) {
    this.a = a;
  }

  public String getA() {
    return this.a;
  }

  public void setA(String a) {
    this.a = a;
  }

  public String getB() {
    return this.b;
  }

  public void setB(String b) {
    this.b = b;
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  /**
   * Hibernate entities need no-arg constructors so that they can be reconstituted from the database.
   */
  protected Example() {
    // noop
  }

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  private static final long serialVersionUID = 1L;

  @Column(name = "a", nullable = false)
  private String a;

  @Column(name = "b", nullable = true)
  private String b;
}
