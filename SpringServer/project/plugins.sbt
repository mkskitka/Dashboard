resolvers ++= Seq(
  "nexus" at "http://savant-tools:8181/content/groups/public",
  "artifactory" at "http://repo.cra.com:8081/artifactory/repo"
)

addSbtPlugin("com.earldouglas" % "xsbt-web-plugin" % "4.0.0")

addSbtPlugin("com.typesafe.sbteclipse" % "sbteclipse-plugin" % "5.2.2")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.3.3")
