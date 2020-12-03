//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.web.rest;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.cra.springserver.service.CrudService;
import com.cra.springserver.model.Example;
import com.cra.springserver.web.dto.ExampleDTO;

// @RestController is a shortcut for
//   @Controller
//   @RequestBody
// This tells Spring that this class is to be loaded as a controller when
// scanning for components.  Furthermore, it says that the results of each method
// are to be bound directly to the HTTP response, bypassing any views
@RestController
@RequestMapping("example")
public class ExampleEndpoint {
  // =============================================================================================================================
  // public
  // =============================================================================================================================

  // example of returning a static map
  @RequestMapping(method = GET, path = "map", produces = APPLICATION_JSON_VALUE)
  public Map<String, String> getMap() {
    Map<String, String> m = new HashMap<String, String>();
    m.put("A", "able");
    m.put("B", "baker");
    m.put("C", "charlie");
    LOG.info("Sending map: " + m);
    return m;
  }

  // an example of returning a non-database-backed DTO.
  @RequestMapping(method = GET, path = "dto", produces = APPLICATION_JSON_VALUE)
  public ExampleDTO getDto() {
    return new ExampleDTO("able", "baker");
  }

  // Example of getting a database-backed entity and wrapping it in a DTO.
  // Note that we are using the ResponseEntity structure here to wrap the
  // result because it allows us to control the response status code.
  //
  // Example: http://localhost:8080/example/1
  @RequestMapping(method = GET, path = "{id}", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<ExampleDTO> getExample(@PathVariable("id") Long id) {
    Example ex = this.crudSvc.retrieveById(Example.class, id);
    if (ex == null) {
      return new ResponseEntity<ExampleDTO>(HttpStatus.NOT_FOUND);
    } else {
      return ResponseEntity.ok(new ExampleDTO(ex));
    }
  }

  // Example of endpoint for creating a new database-backed entity, normally
  // this would be done with a POST method as illustrated below. This GET
  // implementation allows us to access it via a browser URL however.
  //
  // Example: http://localhost:8080/example/new?a=foo&b=bar
  @RequestMapping(method = GET, path = "new", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<ExampleDTO> getNewExample(@RequestParam("a") String a,
      @RequestParam(name = "b", required = false) String b) {
    Example ex = new Example(a);
    ex.setB(b);
    this.crudSvc.create(ex);
    return new ResponseEntity<ExampleDTO>(new ExampleDTO(ex), HttpStatus.CREATED);
  }

  // Example of endpoint for creating a new database-backed entity using POST
  // semantics. Depending on your use case, you may want to return the newly
  // created entity as we are doing here,
  // or you may want to return the URL of the new entity (e.g.
  // http://localhost:8080/example/{new_entity_id}), or you may want to simply
  // return the new entity id.
  @RequestMapping(method = POST, path = "new", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<ExampleDTO> postExample(@RequestBody(required = true) @Validated ExampleDTO exDto) {
    // POST is for creating new entities, not updating existing ones
    if (exDto.getId() != null) {
      // you could also return a MOVED_PERMANENTLY response pointing at the
      // URL to the existing entity.
      return new ResponseEntity<ExampleDTO>(HttpStatus.BAD_REQUEST);
    } else {
      Example ex = exDto.assemble(this.crudSvc);
      return new ResponseEntity<ExampleDTO>(new ExampleDTO(ex), HttpStatus.CREATED);
    }
  }

  // Example of an endpoint for updating an existing database-backed entity.
  // Normally this would be done with a PUT method as illustrated below.
  // This GET implementation allows us to access it interactively via a browser
  //
  // Example: http://localhost:8080/example/1?a=foo&b=bar
  @RequestMapping(method = GET, path = "update/{id}", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<ExampleDTO> getUpdateExample(@PathVariable("id") Long id,
      @RequestParam(name = "a", required = false) String a, @RequestParam(name = "b", required = false) String b) {
    Example ex = this.crudSvc.retrieveById(Example.class, id);
    if (ex == null) {
      return new ResponseEntity<ExampleDTO>(HttpStatus.NOT_FOUND);
    } else {
      // a isn't allowed to be null, so only set it if the param is present
      if (a != null) {
        ex.setA(a);
      }
      ex.setB(b);
      ex = this.crudSvc.update(ex);
      return ResponseEntity.ok(new ExampleDTO(ex));
    }
  }

  // Example of an endpoint for updating a previously-created database-backed
  // entity. The client PUTs the new version as a DTO, which overwrites is
  // assembled and overwrites the existing version.
  @RequestMapping(method = PUT, path = "{id}", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<ExampleDTO> putExample(@PathVariable("id") Long id, @RequestBody(required = true) ExampleDTO exDto) {
    if (id != exDto.getId()) {
      return new ResponseEntity<ExampleDTO>(HttpStatus.BAD_REQUEST);
    }
    Example ex = exDto.assemble(this.crudSvc);
    if (ex == null) {
      return new ResponseEntity<ExampleDTO>(HttpStatus.NOT_FOUND);
    } else {
      return ResponseEntity.ok(new ExampleDTO(ex));
    }
  }

  // Example of an endpoint for deleting an existing database-backed entity.
  // Normall this qwould be done via a DELETE method as illustrated below. This
  // GET implementation allows us to access it interactively via a browser.
  //
  // Example: http://localhost:8080/example/delete/1
  @RequestMapping(method = GET, path = "delete/{id}")
  public ResponseEntity<Void> getDeleteExample(@PathVariable("id") Long id) {
    return deleteExample(id);
  }

  // Example of an endpoint for deleting a previously-created database-backed
  // entity.
  @RequestMapping(method = DELETE, path = "{id}")
  public ResponseEntity<Void> deleteExample(@PathVariable("id") Long id) {
    Example ex = this.crudSvc.retrieveById(Example.class, id);
    if (ex == null) {
      return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
    } else {
      if (this.crudSvc.delete(ex)) {
        return ResponseEntity.ok().build();
      } else {
        // should never get here because we've already loaded the object
        return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
      }
    }
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
  private static final Logger LOG = LoggerFactory.getLogger(ExampleEndpoint.class);

  // used for communicating with the persistence layer
  @Autowired
  private CrudService crudSvc;
}
