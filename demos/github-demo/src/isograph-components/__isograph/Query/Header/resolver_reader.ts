import type {ComponentReaderArtifact, ExtractSecondParam, ReaderAst } from '@isograph/react';
import { Query__Header__param } from './param_type';
import { Header as resolver } from '../../../header';
import User__Avatar__resolver_reader from '../../User/Avatar/resolver_reader';

const readerAst: ReaderAst<Query__Header__param> = [
  {
    kind: "Linked",
    fieldName: "viewer",
    alias: null,
    arguments: null,
    condition: null,
    isUpdatable: false,
    selections: [
      {
        kind: "Scalar",
        fieldName: "name",
        alias: null,
        arguments: null,
        isUpdatable: false,
      },
      {
        kind: "Resolver",
        alias: "Avatar",
        arguments: null,
        readerArtifact: User__Avatar__resolver_reader,
        usedRefetchQueries: [],
      },
    ],
    refetchQueryIndex: null,
  },
];

const artifact: ComponentReaderArtifact<
  Query__Header__param,
  ExtractSecondParam<typeof resolver>
> = {
  kind: "ComponentReaderArtifact",
  fieldName: "Query.Header",
  resolver,
  readerAst,
  hasUpdatable: false,
};

export default artifact;
