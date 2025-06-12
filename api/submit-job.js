
import { supabaseAdmin } from '../../utils/supabaseAdminClient';

export default async function handler(req, res) {
  const { title, description } = req.body;

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert([{ title, description }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ job: data[0] });
}
