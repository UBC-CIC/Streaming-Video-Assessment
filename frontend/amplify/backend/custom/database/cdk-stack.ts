import * as cdk from 'aws-cdk-lib';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });

    const vpc = new ec2.Vpc(this, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: 'private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        }
      ],
      maxAzs: 2
    });

    const dbsg = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true
    });
    dbsg.addIngressRule(dbsg, ec2.Port.allTraffic(), "all from self");
    dbsg.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.allTraffic(), "all out");

    const cluster = new rds.DatabaseCluster(this, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_06_0 }),
      writer: rds.ClusterInstance.serverlessV2('writer', {
        publiclyAccessible: true
      }),
      defaultDatabaseName: "dropzone",
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
      },
      vpc: vpc,
      securityGroups: [dbsg]
    });

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: cluster.instanceEndpoints[0].hostname
    });

    new cdk.CfnOutput(this, `SecurityGroupId`, {
      value: dbsg.securityGroupId
    })

    new cdk.CfnOutput(this, "SubnetId0", {
      value: vpc.privateSubnets[0].subnetId
    })

    new cdk.CfnOutput(this, "SubnetId1", {
      value: vpc.privateSubnets[1].subnetId
    })

    new cdk.CfnOutput(this, "SecretName", {
      value: cluster.secret.secretName
    })
  }
}
