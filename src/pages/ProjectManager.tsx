
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './ProjectManager.css'

type Project = {
  id: string
  name: string
  description: string
  genre: string
  platform: 'Roblox' | 'Unreal'
  status: 'In Development' | 'Shipped'
  image_url: string | null
  visits: number
  peak_ccu: number
  featured_slot: number | null
}

type ProjectForm = {
  name: string
  description: string
  genre: string
  platform: 'Roblox' | 'Unreal'
  status: 'In Development' | 'Shipped'
  visits: number
  peak_ccu: number
  featured_slot: string
}

const emptyForm: ProjectForm = {
  name: '',
  description: '',
  genre: 'Simulator',
  platform: 'Roblox',
  status: 'In Development',
  visits: 0,
  peak_ccu: 0,
  featured_slot: '',
}



export default function ProjectManager({
  onProjectsChanged,
}: {
  onProjectsChanged?: () => void
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function loadProjects() {
    setLoading(true)

    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('created_at', { ascending: false })

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

  function updateForm<K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K],
  ) {
    setForm(previous => ({ ...previous, [key]: value }))
  }

  function startEditing(project: Project) {
    setEditingId(project.id)
    setCurrentImage(project.image_url)
    setImageFile(null)
    setForm({
      name: project.name,
      description: project.description,
      genre: project.genre,
      platform: project.platform,
      status: project.status,
      visits: project.visits,
      peak_ccu: project.peak_ccu,
      featured_slot: project.featured_slot?.toString() ?? '',
    })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setImageFile(null)
    setCurrentImage(null)

    const fileInput = document.getElementById(
      'project-image',
    ) as HTMLInputElement | null

    if (fileInput) fileInput.value = ''
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      let imageUrl = currentImage

      if (imageFile) {
        const extension =
          imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'

        const imagePath =
          `${crypto.randomUUID()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(imagePath, imageFile, {
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(imagePath)

        imageUrl = publicUrlData.publicUrl
      }

      const projectData = {
        name: form.name.trim(),
        description: form.description.trim(),
        genre: form.genre.trim(),
        platform: form.platform,
        status: form.status,
        image_url: imageUrl,
        visits: form.visits,
        peak_ccu: form.peak_ccu,
        featured_slot: form.featured_slot
          ? Number(form.featured_slot)
          : null,
        updated_at: new Date().toISOString(),
      }

      const query = editingId
        ? supabase
            .from('portfolio_projects')
            .update(projectData)
            .eq('id', editingId)
        : supabase
            .from('portfolio_projects')
            .insert(projectData)

      const { data, error } = await query.select()

      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        throw new Error(
          'No project was saved. Check your admin permissions.',
        )
      }

      setMessage(editingId ? 'Project updated successfully.' : 'Project added successfully.')
      resetForm()
      await loadProjects()
      onProjectsChanged?.()
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`,
    )

    if (!confirmed) return

    setMessage('')

    const { error } = await supabase
      .from('portfolio_projects')
      .delete()
      .eq('id', project.id)
      .select('id')

    if (error) {
      setMessage(`Delete failed: ${error.message}`)
      return
    }

    setMessage('Project deleted.')
    if (editingId === project.id) resetForm()
    await loadProjects()
    onProjectsChanged?.()
  }

  return (
    <div className="project-manager">
      <form className="project-editor" onSubmit={handleSave}>
        <div className="project-editor-heading">
          <div>
            <h2>{editingId ? 'Edit project' : 'Add a project'}</h2>
            <p>
              {editingId
                ? 'Update your existing project.'
                : 'Every project starts in your central inventory.'}
            </p>
          </div>
          <span className="project-editor-count">
            {editingId ? 'EDITING' : 'NEW ENTRY'}
          </span>
        </div>

        <label className="project-field">
          <span>Project name</span>
          <input
            value={form.name}
            onChange={event => updateForm('name', event.target.value)}
            maxLength={100}
            required
            placeholder="e.g. Bee's Drill Empire"
          />
        </label>

        <label className="project-field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={event => updateForm('description', event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="What makes this project interesting?"
          />
        </label>

        <label className="project-field">
          <span>Project image</span>
          <input
            id="project-image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={event => {
              const file = event.target.files?.[0] ?? null

              if (file && file.size > 10 * 1024 * 1024) {
                setMessage('Images must be 10 MB or smaller.')
                event.target.value = ''
                setImageFile(null)
                return
              }

              setMessage('')
              setImageFile(file)
            }}
            required={!editingId && !currentImage}
          />
          <small>PNG, JPG, WebP or GIF. Maximum 10 MB.</small>
        </label>

        {(imageFile || currentImage) && (
          <div className="project-image-preview">
            <img
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : currentImage ?? ''
              }
              alt="Project preview"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null)
                setCurrentImage(null)
                const input = document.getElementById(
                  'project-image',
                ) as HTMLInputElement | null
                if (input) input.value = ''
              }}
            >
              Remove image
            </button>
          </div>
        )}

        <div className="project-fields-grid">
          <label className="project-field">
            <span>Genre</span>
            <input
              value={form.genre}
              onChange={event => updateForm('genre', event.target.value)}
              maxLength={60}
              required
              placeholder="Simulator, Tycoon, RPG..."
            />
          </label>

          <label className="project-field">
            <span>Platform</span>
            <select
              value={form.platform}
              onChange={event =>
                updateForm('platform', event.target.value as ProjectForm['platform'])
              }
            >
              <option value="Roblox">Roblox</option>
              <option value="Unreal">Unreal</option>
            </select>
          </label>

          <label className="project-field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={event =>
                updateForm('status', event.target.value as ProjectForm['status'])
              }
            >
              <option value="In Development">In Development</option>
              <option value="Shipped">Shipped</option>
            </select>
          </label>

          <label className="project-field">
            <span>Homepage placement</span>
            <select
              value={form.featured_slot}
              onChange={event => updateForm('featured_slot', event.target.value)}
            >
              <option value="">None — not featured</option>
              <option value="1">Featured slot 1</option>
              <option value="2">Featured slot 2</option>
              <option value="3">Featured slot 3</option>
            </select>
          </label>

          <label className="project-field">
            <span>Total visits</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.visits}
              onChange={event => updateForm('visits', Number(event.target.value))}
              required
            />
          </label>

          <label className="project-field">
            <span>Peak CCU</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.peak_ccu}
              onChange={event => updateForm('peak_ccu', Number(event.target.value))}
              required
            />
          </label>
        </div>

        {message && (
          <p className="project-feedback" role="status">
            {message}
          </p>
        )}

        <div className="project-form-actions">
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel editing
            </button>
          )}

          <button type="submit" disabled={saving}>
            {saving
              ? 'Saving...'
              : editingId
                ? 'Save project changes ↗'
                : 'Add project ↗'}
          </button>
        </div>
      </form>

      <section className="project-inventory">
        <div className="project-inventory-heading">
          <div>
            <h2>All projects</h2>
            <p>{projects.length} project(s) in your inventory</p>
          </div>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet. Add your first one above.</p>
        ) : (
          <div className="project-inventory-list">
            {projects.map(project => (
              <article className="project-inventory-card" key={project.id}>
                {project.image_url ? (
                  <img src={project.image_url} alt="" />
                ) : (
                  <div className="project-inventory-no-image">B.</div>
                )}

                <div className="project-inventory-details">
                  <h3>{project.name}</h3>
                  <p>
                    {project.platform} · {project.genre}
                  </p>
                  <span
                    className={`project-status-dot ${
                      project.status === 'Shipped' ? 'shipped' : 'development'
                    }`}
                  />
                  <span className="project-inventory-status">
                    {project.status}
                  </span>
                  <p>
                    {project.featured_slot
                      ? `Featured slot ${project.featured_slot}`
                      : 'Not featured'}
                  </p>
                </div>

                <div className="project-inventory-actions">
                  <button type="button" onClick={() => startEditing(project)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="project-delete-button"
                    onClick={() => void handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

