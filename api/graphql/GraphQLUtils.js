function handleError(msg, e) {
  console.error(`${msg}: ${e.message}`);
  throw e;
}

function getGraphQLProjectionKeys(info) {
  const projection = {};
  const children = [];
  const fields = info.fieldNodes[0].selectionSet.selections;

  fields.forEach(field => {
    if (field.selectionSet) {
      children.push(field.name.value);

    // Project the top-level keys only
    } else {
      projection[field.name.value] = 1;
    }
  });
  return [projection, children];
}

module.exports = {
  handleError,
  getGraphQLProjectionKeys
};