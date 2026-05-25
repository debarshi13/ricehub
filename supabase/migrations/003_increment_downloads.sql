create or replace function public.increment_downloads(rice_id uuid)
returns void as $$
begin
  update public.rices set downloads = downloads + 1 where id = rice_id;
end;
$$ language plpgsql security definer;
