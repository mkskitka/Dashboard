//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.model;

import java.io.Serializable;

/**
 * A baseline model object that has a simple synthetic identifier.
 *
 * @author Dominic Anello (danello@cra.com)
 */
public interface ModelObject<T extends Serializable> extends Serializable {
  public T getId();
}
