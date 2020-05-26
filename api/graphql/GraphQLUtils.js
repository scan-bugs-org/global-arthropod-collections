function handleError(msg, e) {
  console.error(`${msg}: ${e.message}`);
  throw e;
}

function getGraphQLProjectionKeys(fields) {
  const projection = {};
  // Grab the top-level keys only
  fields.forEach(field => {
    if (!field.selectionSet) {
      projection[field.name.value] = 1;
    }
  });
  return projection;
}

module.exports = {
  handleError,
  getGraphQLProjectionKeys
};