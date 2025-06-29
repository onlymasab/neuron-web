'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface Person {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  file_count: number;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      const supabase = createClient();

      // Query for users who were shared files (unique users)
      const { data, error } = await supabase
        .from('shared_user_profiles') // make sure this view/table exists
        .select('id, name, email, avatar_url, file_count');

      if (!error && data) {
        setPeople(data);
      } else {
        console.error('Failed to fetch shared user profiles:', error);
      }

      setLoading(false);
    };

    fetchPeople();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full text-4xl h-full px-15.5">
      <h2 className="text-2xl font-medium py-[3vh] border-b border-b-[#A2A2A2]">
        People
      </h2>

      {loading ? (
        <p className="text-gray-500 text-base">Loading...</p>
      ) : people.length === 0 ? (
        <p className="text-gray-500 text-base">No people found.</p>
      ) : (
        <div className="mt-[2.5vh] flex flex-wrap gap-4">
          {people.map((person) => (
            <Link
              href={`/cloud/people/${person.id}`}
              key={person.id}
              className="flex flex-col gap-[3vh] p-4 bg-white rounded-lg 2xl:w-58 w-43 shadow-[0px_0px_4px_rgba(0,0,0,0.15)]"
            >
              <header className="flex justify-between items-start w-full text-[10px] font-medium tracking-wide">
                {person.avatar_url ? (
                  <Image
                    src={person.avatar_url}
                    alt={person.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover size-[clamp(3vw,40px,5vw)]"
                  />
                ) : (
                  <div className="size-[clamp(3vw,40px,5vw)] rounded-full bg-[#c9c9c9] text-white font-semibold flex items-center justify-center">
                    {person.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <p>{person.file_count} Files</p>
              </header>

              <section className="max-w-full">
                <h2 className="text-[clamp(1rem,1.3vw,1.5rem)] font-medium text-black">
                  {person.name}
                </h2>
                <p className="mt-1 text-xs 2xl:text-sm font-semibold tracking-normal text-[#74726f]">
                  {person.email}
                </p>
              </section>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
