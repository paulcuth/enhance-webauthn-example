export async function get(req) {
  const { user } = req.session;

  return {
    json: { user },
  };
}
