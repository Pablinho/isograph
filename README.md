# Isograph

> Select your components like you select your fields — with GraphQL!

- Read the [docs](https://isograph.dev/docs/) and in particular the [quickstart guide](https://isograph.dev/docs/quickstart/).
- Watch the [talk at GraphQL Conf](https://www.youtube.com/watch?v=gO65JJRqjuc).
- Join the discord: https://discord.gg/Q2c5tM5T8A (#isograph channel on the GraphQL discord.)
- [Follow the official Twitter account](https://twitter.com/isographlabs).

## About Isograph: Fetching data and app structure

### What is Isograph, and what are resolvers?

Isograph is a framework for building React applications that are backed by GraphQL data. In Isograph, components that read data can be selected from the graph, and automatically have the data they require passed in. Consider this example avatar component:

```js
export const Avatar = iso`
  User.Avatar @component {
    name,
    avatar_url,
  }
`(function AvatarComponent({ data, ...otherRuntimeProps }) {
  return <CircleImage image={data.avatar_url} />;
});
```

This avatar component is available on any GraphQL User. You might use this avatar component in another component, such as a button that navigates to a given user's profile.

```js
export const UserProfileButton = iso`
  User.UserProfileButton @component {
    Avatar,

    # you can also select server fields, like in regular GraphQL:
    id,
    name,
  }
`(function UserProfileButtonComponent({ data }) {
  return (
    <Button onClick={() => navigateToUserProfile(data.id)}>
      {data.name}
      <data.Avatar />
    </Button>
  );
});
```

These calls to `iso` define resolvers, which are functions from graph data (such as the user's name) to an arbitrary value. With Isograph, it's resolvers all the way down — your entire app can be built in this way!

### How does Isograph fetch data?

At the root of each page, you will define an entrypoint with `isoFetch`. Isograph's compiler finds and processes all the entrypoints in your codebase, and will generate the appropriate GraphQL query.

So, if the compiler encounters `` isoFetch`Query.UserList `; ``, it would generate a query that would fetch all the server fields needed for the `Query.UserList` resolver and all of the resolvers that it references. Then, when the user navigates to the user list page, that query would be executed.

For example, the data might be fetched during render as follows:

```js
const UserListPageQuery = require("@iso/Query/UserList.isograph");

function UserListPageRoute() {
  const queryVariables = {};
  const { queryReference } = useLazyReference(
    isoFetch`Query.UserList`,
    queryVariables
  );

  const additionalRenderProps = {};
  const Component = read(queryReference);
  return <Component {...additionalRenderProps} />;
}
```

> Note that the call to `read(queryReference)` will suspend if the required data is not present in the store, so make sure that either `UserListPageRoute` is wrapped in a `React.Suspense` boundary, or that the `queryReference` is only read in a child component that is wrapped in a suspense boundary.

Now, when `UserListPageRoute` is initially rendered, Isograph will make an API call.

### How do components receive their data?

You may have noticed that when we rendered `<data.Avatar />`, we did not pass the data that the `Avatar` needs! Instead, when the component is rendered, Isograph will `read` the data that the `Avatar` component needs, and pass it to `Avatar`. The calling component:

- only passes additional props that don't affect the query data, like `onClick`, and
- does **not** know what data `Avatar` expects, and never sees the data that `Avatar` reads out. This is called **data masking**, and it's a crucial reason that teams of multiple developers can move quickly when building apps with Isograph: because no component sees the data that another component selected, changing one component cannot affect another!

### Big picture

At the root of a page, you will define an `isoFetch` entrypoint. For any such entrypoint, Isograph will:

- Recursively walk it's dependencies and create a single GraphQL query that fetches **all** of the data reachable from this literal.
- When that page renders, or possibly sooner, Isograph will make the API call to fetch that data.
- Each resolver will independently read the data that it specifically required.

## About Isograph: `@exposeField`

> Currently, `@exposeField` is only processed if it is on the Mutation type. But, it will be made more generally available at some point.

Types with the `@exposeField(field: String!, path: String!, field_map: [FieldMap!]!)` directive have their fields re-exposed on other objects. For example, consider this schema:

```graphql
input SetUserNameParams {
  id: ID!
  some_other_param: String!
}

type SetUserNameResponse {
  updated_foo: User!
}

type Mutation
  @exposeField(
    field: "set_user_name" # expose this field
    path: "updated_foo" # on the type at this path (relative to the response object)
    field_map: [{ from: "id", to: "id" }] # mapping these fields
  ) {
  set_user_name(input: SetUserNameParams!): SetUserNameResponse!
}
```

In the above example, the `set_foo` field will be made available on every `User` object, under the key `__set_user_name` (this will be customizable.) So, one could write a resolver:

```js
export const UpdateUserNameButton = iso`
  User.UpdateUserNameButton {
    __set_foo,
  }
`(({ data: { __set_user_name } }) => {
  return (
    <div onClick={() => __set_user_name({ input: { new_name: "Superman" } })}>
      Name me Superman
    </div>
  );
});
```

Clicking that button executes a mutation. The `id` field is automatically passed in (i.e. it comes from whatever `User` object where this field was selected.)

The fields that are refetched as part of the mutation response are whatever fields are selected on that user in the _merged_ query! So, if on that same `User`, we also (potentially through another resolver) selected the `name` field, the mutation response would include `name`! If, later, we selected `email`, it would also be fetched.

## Getting involved and learning more

There's a lot more. These docs are threadbare.

- See the sample apps in [`./demos`](./demos/).
- Watch the [talk at GraphQL Conf](https://www.youtube.com/watch?v=gO65JJRqjuc).
- Join the discord: https://discord.gg/Q2c5tM5T8A (#isograph channel on the GraphQL discord.)
- [Follow the official Twitter account](https://twitter.com/isographlabs)

## Other, older resources

- See [the developer experience of using Isograph](https://www.youtube.com/watch?v=f1nfXc3VeTk).
- Read [the substack article](https://isograph.substack.com/p/introducing-isograph).

## Licensing

Isograph is an open source software project and licensed under the terms of the MIT license.
