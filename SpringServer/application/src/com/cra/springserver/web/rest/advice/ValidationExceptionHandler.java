//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.rest.advice;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import java.util.List;
import java.util.Locale;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.cra.springserver.web.dto.error.ErrorMessageDTO;
import com.cra.springserver.web.dto.error.ErrorMessageType;

@ControllerAdvice
@ResponseBody
public class ValidationExceptionHandler {
  // =============================================================================================================================
  // public
  // =============================================================================================================================
  @Autowired
  public ValidationExceptionHandler(MessageSource msgSrc) {
    this.msgSrc = msgSrc;
  }

  public MessageSource getMessageSource() {
    return this.msgSrc;
  }

  public void setMessageSource(MessageSource msgSrc) {
    this.msgSrc = msgSrc;
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(BAD_REQUEST)
  public ErrorMessageDTO processFieldValidationError(MethodArgumentNotValidException e) {
    ErrorMessageDTO dto = new ErrorMessageDTO(ErrorMessageType.VALIDATION_ERROR);
    extractBindingResultMessage(e.getBindingResult(), dto);
    return dto;
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  private MessageSource msgSrc;

  private void extractBindingResultMessage(BindingResult result, ErrorMessageDTO dto) {
    String path = StringUtils.trimToNull(result.getNestedPath());
    List<String> messages = dto.getMessages();
    messages.add("Validation error in " + result.getObjectName() + (path == null ? "" : "." + path));
    Locale locale = Locale.getDefault();

    for (ObjectError err : result.getGlobalErrors()) {
      messages.add(this.msgSrc.getMessage(err, locale));
    }

    for (FieldError err : result.getFieldErrors()) {
      messages.add(this.msgSrc.getMessage(err, locale));
    }
  }
}
