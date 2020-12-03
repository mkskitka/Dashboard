import sbt._
import Keys._

name := "tailsmith-springserver"

val hibernateVersion = "5.1.0.Final"
val log4jVersion = "2.6.1"

// # spring-security builds off of a particular spring version.
// # Update these together if you are not prepared to spend some time customizing
// # the ivy dependencies.  Otherwise, when updating the spring-securty version, be
// # sure to update to at least the version of spring that spring-security depends
// # on.  For example, spring-security 4.1.3 is compatable with spring 4.0.x,
// # however, spring-security_4.1.3 is configured to depend on spring_4.3.2.  So
// # attempting to specify an older version of spring naievly will just cause
// # spring-security to drag in the newer version.  You'd have to manually exclude
// # all the spring deps from the spring-security configuration.

val springVersion = "4.3.2.RELEASE"
val springSecurityVersion = "4.1.3.RELEASE"
val jacksonVersion = "2.9.4"

lazy val commonSettings = Seq(
  organization := "com.cra.tailsmith",
  scalaVersion := "2.12.5",
  publishMavenStyle := true,
  retrieveManaged := true
)


lazy val root = (project in file("."))
  .settings(commonSettings)
  .settings(publishLocal := {})
  .settings(publish := {})
  .dependsOn(springserver)
  .aggregate(springserver)
  
lazy val springserver = (project in file("application"))
  .settings(commonSettings)
  .enablePlugins(TomcatPlugin)
  .settings(name := "springserver")
  .settings(javaSource in Compile := baseDirectory.value / "src")
  .settings(javaSource in Test := baseDirectory.value / "test")
  .settings(resourceDirectory in Test := baseDirectory.value / "test" / "resources")
  .settings(resourceDirectory in Compile := baseDirectory.value / "config")
  .settings(resolvers ++= Seq(
    "artifactory" at "http://repo.cra.com:8081/artifactory/repo"
  ))
  .settings(webappWebInfClasses := true)
  .settings(
    // Latest version of tomcat
    containerLibs in Tomcat := Seq("com.github.jsimone" % "webapp-runner" % "8.0.44.0" intransitive())
  )
  .settings(packageBin in Compile := ((packageBin in Compile) dependsOn (test in Test)).value)
  .settings(
  // We don't need the scala version or module number in the .war.  Just use the project's name
  artifactName := { (v: ScalaVersion, m: ModuleID, a: Artifact) =>
    s"${a.name}.${a.extension}"
  })
  .settings(sourceDirectory in webappPrepare := baseDirectory.value / "WebContent")
  .settings(testOptions += Tests.Argument("-q", "-v"))
  .settings(libraryDependencies ++= Seq(
    "com.typesafe.play" %% "play-json" % "2.6.9",
    "com.google.guava" % "guava" % "22.0",
	"com.google.code.gson" % "gson" % "2.8.2",
    "org.apache.commons" % "commons-lang3" % "3.7",
    "joda-time" % "joda-time" % "2.9.9",
    // <!-- HTTP Async Client -->
    // <!-- https://mvnrepository.com/artifact/org.apache.httpcomponents/httpasyncclient -->
    "org.apache.httpcomponents" % "httpasyncclient" % "4.1.3",
    // <!-- JUnit -->
    "junit" % "junit" % "4.11" % Test,
    "javax.servlet" % "javax.servlet-api" % "3.0.1" % Provided,
    "com.novocode" % "junit-interface" % "0.11" % Test,
    // <!-- logging -->
    "org.apache.logging.log4j" % "log4j-api" % log4jVersion,
    "org.apache.logging.log4j" % "log4j-core" % log4jVersion,
    "org.apache.logging.log4j" % "log4j-slf4j-impl" % log4jVersion,
    "org.apache.logging.log4j" % "log4j-web" % log4jVersion,
    // <!-- Core spring dependencies.  These are not optional. -->
    "org.springframework" % "spring-context" % springVersion,
    // <!-- Spring test. -->
    "org.springframework" % "spring-test" % "4.0.5.RELEASE",
    // <!-- Spring web -->
    "org.springframework" % "spring-webmvc" % springVersion,
    "org.springframework" % "spring-oxm" % springVersion,
    // <!-- JSON binding for web services -->
    "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
    "com.fasterxml.jackson.module" % "jackson-module-jaxb-annotations" % jacksonVersion,
    // <!-- ORM configuration.  Remove if you do not need a database. -->
    "org.hibernate" % "hibernate-core" % hibernateVersion,
    "org.hibernate" % "hibernate-c3p0" % hibernateVersion,
    // <!-- Uncomment to enable hibernate caching.  You must also enable caching in sessionFactory bean within
    //      applicationContext.xml -->
    // "org.hibernate" % "hibernate-ehcache" % hibernateVersion,
    "org.springframework" % "spring-tx" % springVersion,
    "org.springframework" % "spring-orm" % springVersion,
    // <!-- Spring Security -->
    "org.springframework.security" % "spring-security-web" % springSecurityVersion,
    "org.springframework.security" % "spring-security-config" % springSecurityVersion,
    // <!-- JDBC driver configuration.  Remove if you do not need a database -->
    "org.postgresql" % "postgresql" % "9.4.1208.jre7",
    "com.mchange" % "c3p0" % "0.9.5.2",
    // <!-- used for websocket server support -->
    "org.springframework" % "spring-websocket" % springVersion,
    "org.springframework" % "spring-messaging" % springVersion,
	  "org.apache.tomcat.embed" % "tomcat-embed-websocket" % "8.0.46",
	  "org.powermock" % "powermock-module-junit4" % "1.6.4",
	  "org.powermock" % "powermock-api-mockito" % "1.6.4",
    "com.fasterxml.jackson.core" % "jackson-core" % "2.9.4",
    // <!-- Lombok for code streamlining -->
    "org.projectlombok" % "lombok" % "1.18.12" % "provided",
    // <!-- JSON processing -->
    "com.googlecode.json-simple" % "json-simple" % "1.1.1",
    // <!-- Annotations -->
    "org.jetbrains" % "annotations" % "16.0.1",
    // <!-- Math rounding library -->
    "org.decimal4j" % "decimal4j" % "1.0.3"
	))
