
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './FeaturedSlots.css'

type Project = {
  id: string
  name: string
  platform: 'Roblox' | 'Unreal'
  genre: string
  status: 'In Development' | 'Shipped'
  image_url: string | null
  featured_slot: number | null
}

export default function FeaturedSlots() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [savingSlot, setSavingSlot] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  async function loadProjects() {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select(
        'id, name, platform, genre, status, image_url, featured_slot',
      )
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
  }, [])

  async function assignProject(slot: number, projectId: string) {
    setSavingSlot(slot)
    setMessage('')

    try {
      const currentProject = projects.find(
        project => project.featured_slot === slot,
      )

      if (projectId === currentProject?.id) return

      // Release the current project in this slot first.
      if (currentProject) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update({
            featured_slot: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentProject.id)
          .select('id')

        if (error) throw new Error(error.message)
      }

      // An empty selection simply clears this slot.
      if (projectId) {
        const { data, error } = await supabase
          .from('portfolio_projects')
          .update({
            featured_slot: slot,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId)
          .is('featured_slot', null)
          .select('id')

        if (error) throw new Error(error.message)

        if (!data || data.length === 0) {
          throw new Error(
            'This project is already assigned elsewhere. Refresh and try again.',
          )
        }
      }

      await loadProjects()
      setMessage(`Featured slot ${slot} updated.`)
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not update featured slot.',
      )
      await loadProjects()
    } finally {
      setSavingSlot(null)
    }
  }

  return (
    <div className="featured-slots">
      <div className="featured-slots-heading">
        <div>
          <h2>Homepage lineup</h2>
          <p>
            Choose three projects from your inventory. Each project can
            occupy only one slot.
          </p>
        </div>
        <span>03 SLOTS</span>
      </div>

      {message && (
        <p className="featured-slots-message" role="status">
          {message}
        </p>
      )}

      {loading ? (
        <p>Loading your projects...</p>
      ) : projects.length === 0 ? (
        <p>
          Your inventory is empty. Add a project in Other Projects first.
        </p>
      ) : (
        <div className="featured-slots-grid">
          {[1, 2, 3].map(slot => {
            const selected = projects.find(
              project => project.featured_slot === slot,
            )

            // Projects assigned to other slots are excluded.
            const availableProjects = projects.filter(
              project =>
                project.featured_slot === null ||
                project.featured_slot === slot,
            )

            return (
              <article className="featured-slot-card" key={slot}>
                <div className="featured-slot-label">
                  <span>FEATURED / 0{slot}</span>
                  <span>{selected ? 'ASSIGNED' : 'EMPTY'}</span>
                </div>

                {selected?.image_url ? (
                  <img
                    className="featured-slot-image"
                    src={selected.image_url}
                    alt={selected.name}
                  />
                ) : (
                  <div className="featured-slot-empty">
                    <span>{selected ? 'B.' : '+'}</span>
                    <small>
                      {selected ? 'No thumbnail' : 'Choose a project below'}
                    </small>
                  </div>
                )}

                <label className="featured-slot-select">
                  <span>Project</span>
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
                  <div className="featured-slot-details">
                    <strong>{selected.name}</strong>
                    <span>{selected.genre} · {selected.platform}</span>
                    <span
                      className={`featured-status-dot ${
                        selected.status === 'Shipped'
                          ? 'shipped'
                          : 'development'
                      }`}
                    />
                    <small>{selected.status}</small>
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
