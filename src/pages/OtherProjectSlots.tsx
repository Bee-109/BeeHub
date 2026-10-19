
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './OtherProjectSlots.css'

type Project = {
  id: string
  name: string
  platform: 'Roblox' | 'Unreal'
  genre: string
  status: 'In Development' | 'Shipped'
  image_url: string | null
  featured_slot: number | null
  other_project_slot: number | null
}

export default function OtherProjectSlots({
  refreshKey,
}: {
  refreshKey: number
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSlot, setSavingSlot] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  async function loadProjects() {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      setMessage(`Could not load projects: ${error.message}`)
    } else {
      setProjects((data ?? []) as Project[])
    }

    setLoading(false)
  }

useEffect(() => {
  void loadProjects()
}, [refreshKey])

  async function assignProject(slot: number, projectId: string) {
    setSavingSlot(slot)
    setMessage('')

    try {
      const currentProject = projects.find(
        project => project.other_project_slot === slot,
      )

      if (projectId === currentProject?.id) return

      if (currentProject) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update({
            other_project_slot: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentProject.id)

        if (error) throw new Error(error.message)
      }

      if (projectId) {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .update({
            other_project_slot: slot,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId)
          .eq('status', 'Shipped')
          .or(`other_project_slot.is.null,other_project_slot.eq.${slot}`)
          .select('id')

        if (error) throw new Error(error.message)

        if (!data || data.length === 0) {
          throw new Error(
            'This game may already occupy a slot or may not be shipped. Refresh and try again.',
          )
        }
      }

      await loadProjects()
      setMessage(`Other Projects slot ${slot} updated.`)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not update Other Projects slot.',
      )
      await loadProjects()
    } finally {
      setSavingSlot(null)
    }
  }

  return (
    <div className="other-project-slots">
      <div className="other-project-slots-heading">
        <div>
          <h2>Other Projects lineup</h2>
          <p>
            Choose up to six shipped games. Each game can occupy
            only one slot.
          </p>
        </div>
        <span>06 SLOTS</span>
      </div>

      {message && (
        <p className="other-project-slots-message" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading your projects...</p>
      ) : projects.filter(project => project.status === 'Shipped').length === 0 ? (
        <p>No shipped games available. Mark a project as Shipped first.</p>
      ) : (
        <div className="other-project-slots-grid">
          {[1, 2, 3, 4, 5, 6].map(slot => {
            const selected = projects.find(
              project => project.other_project_slot === slot,
            )

const availableProjects = projects.filter(
  project =>
    project.status === 'Shipped' &&
    (
      project.other_project_slot === null ||
      project.other_project_slot === slot
    ),
)

            return (
              <article className="other-project-slot-card" key={slot}>
                <div className="other-project-slot-label">
                  <span>OTHER PROJECT / 0{slot}</span>
                  <span>{selected ? 'ASSIGNED' : 'EMPTY'}</span>
                </div>

                {selected?.image_url ? (
                  <img
                    className="other-project-slot-image"
                    src={selected.image_url}
                    alt={selected.name}
                  />
                ) : (
                  <div className="other-project-slot-empty">
                    <span>{selected ? 'B.' : '+'}</span>
                    <small>
                      {selected ? 'No thumbnail' : 'Choose a shipped game'}
                    </small>
                  </div>
                )}

                <label className="other-project-slot-select">
                  <span>Shipped game</span>
                  <select
                    value={selected?.id ?? ''}
                    disabled={savingSlot !== null}
                    onChange={event =>
                      void assignProject(slot, event.target.value)
                    }
                  >
                    <option value="">— Empty slot —</option>
                    {availableProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} · {project.platform}
                      </option>
                    ))}
                  </select>
                </label>

                {selected && (
                  <div className="other-project-slot-details">
                    <strong>{selected.name}</strong>
                    <span>{selected.genre} · {selected.platform}</span>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
