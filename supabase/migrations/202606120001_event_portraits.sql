alter table public."eventAttendeePreviews"
  add column if not exists "avatarUrl" text;

update public."eventAttendeePreviews"
set "avatarUrl" = case "displayName"
  when 'Riya Malhotra' then 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  when 'Arjun Bedi' then 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  when 'Mehak Jain' then 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  else "avatarUrl"
end
where "avatarUrl" is null;

update public.profiles
set "avatarUrl" = case "displayName"
  when 'Tara Singh' then 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  when 'Zoya Khan' then 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  when 'Dev Arora' then 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  else "avatarUrl"
end
where "avatarUrl" is null;
