//////////////////////////////////////////////////////////////////
// Charles River Analytics, Inc., Cambridge, Massachusetts
//
// Copyright (C) 2016. All Rights Reserved.
// See http://www.cra.com or email info@cra.com for information.
//////////////////////////////////////////////////////////////////
// Custom project or class-specific comments can go here.
//////////////////////////////////////////////////////////////////

package com.cra.springserver.test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import com.mchange.v2.c3p0.ComboPooledDataSource;

/**
 * Use this class to check the validity of the example database setup.
 *
 * @author danello
 */
public class JDBCTest {
  // =============================================================================================================================
  // public
  // =============================================================================================================================

  public static void main(String[] argv) {
    /*
    try {
      // load the driver
      Class.forName("org.postgresql.Driver");

      // open connection
      ComboPooledDataSource ds = new ComboPooledDataSource();
      ds.setDriverClass("org.postgresql.Driver");
      ds.setJdbcUrl("jdbc:postgresql://localhost:5432/springboard?user=springboard&password=springboard");
      Connection c = ds.getConnection();

      // fetch all the rows from the example table.
      Statement stmt = c.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
      ResultSet rs = stmt.executeQuery("select * from public.example");
      ResultSetMetaData meta = rs.getMetaData();

      // print the results
      int rownum = 0;
      while (rs.next()) {
        StringBuilder sb = new StringBuilder();
        sb.append(rownum).append(": ");

        for (int colnum = 1; colnum <= meta.getColumnCount(); colnum++) {
          sb.append(meta.getColumnName(colnum)).append("=").append(rs.getString(colnum));
          if (colnum < meta.getColumnCount()) {
            sb.append("; ");
          }
        }

        System.out.println(sb);
        rownum++;
      }

      stmt.close();
      c.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
    */
  }

  // =============================================================================================================================
  // protected
  // =============================================================================================================================

  // =============================================================================================================================
  // private
  // =============================================================================================================================
}
