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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cra.springserver.model.ModelObject;

@Service
@Transactional
public class CrudServiceImpl implements CrudService {

  @Override
  public <I extends Serializable, T extends ModelObject<I>> I create(T obj) {
    // TODO Auto-generated method stub
    return null;
    
  }

  @Override
  public <I extends Serializable, T extends ModelObject<I>> T retrieveById(Class<T> clazz, I id) {
    // TODO Auto-generated method stub
    return null;
    
  }

  @Override
  public <I extends Serializable, T extends ModelObject<I>> T update(T obj) {
    // TODO Auto-generated method stub
    return null;
    
  }

  @Override
  public <I extends Serializable, T extends ModelObject<I>> boolean delete(T obj) {
    // TODO Auto-generated method stub
    return false;
    
  }
/*
  @Override
  public <I extends Serializable, T extends ModelObject<I>> I create(T obj) {
    @SuppressWarnings("unchecked")
    I id = (I) this.sf.getCurrentSession().save(obj);
    return id;
  }

  @Override
  public <I extends Serializable, T extends ModelObject<I>> T retrieveById(Class<T> clazz, I id) {
    return this.sf.getCurrentSession().byId(clazz).load(id);
  }

  @Override
  public <I extends Serializable, T extends ModelObject<I>> T update(T obj) {
    @SuppressWarnings("unchecked")
    T result = (T) this.sf.getCurrentSession().merge(obj);
    return result;
  }

  @Override
  @SuppressWarnings("unchecked")
  public <I extends Serializable, T extends ModelObject<I>> boolean delete(T obj) {
    if (obj == null || obj.getId() == null) {
      return false;
    }

    // we may need to reload the object if it is currently detached.
    final T o;
    if (this.sf.getCurrentSession().contains(obj)) {
      o = (T) this.sf.getCurrentSession().byId(obj.getClass()).load(obj.getId());
      if (o == null) {
        return false;
      }
    } else {
      o = obj;
    }

    this.sf.getCurrentSession().delete(o);
    return true;
  }
*/
  // =============================================================================================================================
  // public
  // =============================================================================================================================

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  //@Autowired
  //private SessionFactory sf;
}
