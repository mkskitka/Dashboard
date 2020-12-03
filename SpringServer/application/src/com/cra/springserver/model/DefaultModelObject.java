//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.model;

import static javax.persistence.InheritanceType.JOINED;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Inheritance(strategy = JOINED)
public class DefaultModelObject implements ModelObject<Long> {

  @Override
  public Long getId() {
    return this.id;
  }

  // =============================================================================================================================
  // public
  // =============================================================================================================================

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;
}
