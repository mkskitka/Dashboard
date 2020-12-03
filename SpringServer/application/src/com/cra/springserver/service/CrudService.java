//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.service;

import java.io.Serializable;
import com.cra.springserver.model.ModelObject;

/**
 * A service for simple create/read/update/delete operations on model objects.
 *
 * @author Dominic Anello (danello@cra.com)
 */
public interface CrudService {
  /**
   * Persist an object that does not yet have an identity.
   *
   * @param obj
   *          the object to persist. This object will be joined to the current session.
   * @param <I>
   *          The type of {@link Serializable} identifier being used by {@code obj}
   * @param <T>
   *          The type of {@link ModelObject} being operated on.
   *
   * @return the new identity that was created for {@code obj}
   */
  public <I extends Serializable, T extends ModelObject<I>> I create(T obj);

  /**
   * Retrieve a model object from the database by identifier, if it exists.
   *
   * @param clazz
   *          The class of the {@link ModelObject} to load, identified by {@code id}.
   * @param id
   *          the identifier of the object to load.
   *
   * @param <I>
   *          The type of {@link Serializable} identifier being used by {@code obj}
   * @param <T>
   *          The type of {@link ModelObject} being operated on.
   *
   * @return The persistent instance of the entity of type {@code clazz}, identified by {@code id}. Returns {@code null} if no
   *         such entity exists in the persistence layer.
   */
  public <I extends Serializable, T extends ModelObject<I>> T retrieveById(Class<T> clazz, I id);

  /**
   * Update the persisted instance of a {@link ModelObject} with new values.
   *
   * @param obj
   *          the transient object to use to update the persistent instance. This object must have a valid identifier that is
   *          associated to a previously persisted entity. This object will <em>not</em> be joined to the current session, use the
   *          return value of this method to get the persistent instance.
   *
   * @param <I>
   *          The type of {@link Serializable} identifier being used by {@code obj}
   * @param <T>
   *          The type of {@link ModelObject} being operated on.
   *
   * @return the persisted instance that exists after applying the updates represented by {@code obj}.
   */
  public <I extends Serializable, T extends ModelObject<I>> T update(T obj);

  /**
   * Delete a {@link ModelObject}.
   *
   * @param obj
   *          the {@link ModelObject} to delete. This object must have been previously persisted.
   *
   * @param <I>
   *          The type of {@link Serializable} identifier being used by {@code obj}
   * @param <T>
   *          The type of {@link ModelObject} being operated on.
   *
   * @return {@code true} if the {@obj} was deleted, {@code false} if {@code obj was not found in the persistent store.
   */
  public <I extends Serializable, T extends ModelObject<I>> boolean delete(T obj);
}
