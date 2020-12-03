//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.dto.validate;

import java.lang.reflect.Field;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class AnnotationValidator implements Validator {
  // =============================================================================================================================
  // public
  // =============================================================================================================================
  @Override
  public boolean supports(Class<?> clazz) {
    boolean supports = clazz.getAnnotation(XmlRootElement.class) != null;
    return supports;
  }

  @Override
  public void validate(Object target, Errors errors) {
    if (target == null) {
      return;
    }
    Class<?> clazz = target.getClass();
    Field[] fields = clazz.getDeclaredFields();
    for (Field field : fields) {
      XmlElement elemAnno = field.getAnnotation(XmlElement.class);

      if (elemAnno != null) {
        if (!field.isAccessible()) {
          field.setAccessible(true);
        }

        try {
          Object value = field.get(target);
          String fieldName = elemAnno.name().equals("##default") ? field.getName() : elemAnno.name();
          if (elemAnno.required() && !elemAnno.nillable() && value == null) {
            errors.rejectValue(field.getName(), "error.required.field.null", new Object[] { fieldName, clazz.getSimpleName() },
                "Required, non-nillable field has null value");
          }
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        }
      }
    }
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
}
