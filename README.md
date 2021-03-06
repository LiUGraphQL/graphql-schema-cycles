# graphql-schema-cycles
A tool to detected and to enumerate cycles in GraphQL schemas.
The standalone version that you can pull and use locally. For the deployable version for the web see our [graphql-schema-cycles-webapp library](https://github.com/LiUGraphQL/graphql-schema-cycles-webapp.git).

This tool was developed in the context of a student thesis project described in the following thesis report:
* K Soames and J Lind: [Detecting Cycles in GraphQL Schemas](http://urn.kb.se/resolve?urn=urn:nbn:se:liu:diva-156174). Bachelor thesis, Linköping University, 2019.

To clone this repository and its submodules use the command:

  git clone --recurse-submodules https://github.com/LiUGraphQL/graphql-schema-cycles.git
  
If you forgot to do this and only cloned the main repository, then you will only get empty folders for the submodules. In this case however, simply run:

git submodules init
git submodules update
