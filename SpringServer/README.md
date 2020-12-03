# PROCESS Spring Server

## Setup guide

The code is located on Git repo.
If you are not setup for Git, please follow the link below for instructions on setting up Git for Windows:

https://wiki.cra.com/pages/viewpage.action?spaceKey=se&title=Installing+Git+on+Windows

The below steps will setup the PROCESS Spring Server environment:

- Clone the repository `git clone ssh://git@stash.cra.com:7999/proc/process.git`
- Install [Tomcat 8.0.47](https://tomcat.apache.org/download-80.cgi)
- Install [sbt 0.13.12](www.scala-sbt.org/release/docs/Installing-sbt-on-Windows.html)
- Make sure you have Java's jdk1.8.0_X installed. Create a path variable called 'JAVA_HOME' which points to 'jdk1.8.0_X'. Add 'jdk1.8.0_X/bin' to your path.
- Create system variables
	- Hit the start key and type ***System Variables***
	- Select ***Edit system environment variables for your account*** from the Start Menu
	- Select ***Environment Variables*** from the System Properties window
	- select ***New...*** from the System variables section on the bottom half of the screen
	- Make sure you have the following variables:
		- `CATALINA_HOME`
		- `SBT_HOME` 			

##### Resolving Dependencies

The server has a dependency on Figaro 5.1.0.0 and the MetaModel library.
To resolve these dependencies, the MetaModel library has to be published 
to the local Ivy repository. The MetaModel includes the correct Figaro version.

1. The MetaModel codebase is part of the PROCESS repository. Build the MetaModel,
   and publish the library to the local Ivy repository.
   ```
    cd process/MetaModel
    sbt clean compile
    sbt publish-local
   ```

##### Compiling Spring Server

To clean and compile the project:
```
cd process/SpringServer
sbt clean compile
```

##### Running Spring Server in Development Mode

You can run the application using embedded tomcat within sbt via:
```
cd process/SpringServer
sbt tomcat:start tomcat:join
```

Sample services may be run to check connection to the server, when running in development mode:

```
- In a Firefox or Chrome browser, visit the following locations:
		- http://localhost:8080/example/map
		- http://localhost:8080/example/dto
```

##### Packaging Spring Server for Deployment

You can package the project into a .war to be deployed within your tomcat container by following these instructions:
```
cd process/SpringServer
sbt test:clean
sbt package

The resultant war file will be placed in: application/target/scala-2.12/springserver.war
```



