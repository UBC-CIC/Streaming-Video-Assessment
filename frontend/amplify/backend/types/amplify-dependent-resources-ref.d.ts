export type AmplifyDependentResourcesAttributes = {
  api: {
    backend: {
      ApiId: "string";
      ApiName: "string";
      RootUrl: "string";
    };
  };
  auth: {
    backendd8f920f8: {
      AppClientID: "string";
      AppClientIDWeb: "string";
      IdentityPoolId: "string";
      IdentityPoolName: "string";
      UserPoolArn: "string";
      UserPoolId: "string";
      UserPoolName: "string";
    };
  };
  function: {
    api: {
      Arn: "string";
      LambdaExecutionRole: "string";
      LambdaExecutionRoleArn: "string";
      Name: "string";
      Region: "string";
    };
  };
};
