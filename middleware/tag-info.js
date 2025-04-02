export default async function (ctx) {
  const { store, $api } = ctx
  await store.dispatch('tag/getTagsList', { $api })
}
