import type {MutationReaderArtifact, RefetchQueryNormalizationArtifact, ReaderAst} from '@isograph/react';
import { PetStats__refetch_pet_stats__param } from './param_type';
const includeReadOutData = (variables: any, readOutData: any) => {
  return variables;
};

import { makeNetworkRequest, type IsographEnvironment } from '@isograph/react';
const resolver = (
  environment: IsographEnvironment,
  artifact: RefetchQueryNormalizationArtifact,
  readOutData: any,
  filteredVariables: any
) => (mutationParams: any) => {
  const variables = includeReadOutData({...filteredVariables, ...mutationParams}, readOutData);
  makeNetworkRequest(environment, artifact, variables);
};


const readerAst: ReaderAst<PetStats__refetch_pet_stats__param> = [
];

const artifact: MutationReaderArtifact<
  PetStats__refetch_pet_stats__param
> = {
  kind: "MutationReaderArtifact",
  resolver,
  readerAst,
};

export default artifact;
