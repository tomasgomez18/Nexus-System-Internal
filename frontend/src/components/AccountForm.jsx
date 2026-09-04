const PLATFORMS = ['MongoDB', 'Cloudinary', 'Dominio', 'Otro']

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500'

export default function AccountForm({ accounts, onChange }) {
  const update = (index, field, value) => {
    const next = accounts.map((acc, i) =>
      i === index ? { ...acc, [field]: value } : acc
    )
    onChange(next)
  }

  const add = () =>
    onChange([
      ...accounts,
      { platform: 'Otro', email: '', password: '', urlDomain: '', domainSource: '' },
    ])

  const remove = (index) => onChange(accounts.filter((_, i) => i !== index))

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-300">Cuentas de acceso</h3>
        <button
          type="button"
          onClick={add}
          className="text-sm font-medium text-emerald-400 active:scale-95"
        >
          + Agregar cuenta
        </button>
      </div>

      {accounts.map((acc, index) => (
        <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-400">Cuenta {index + 1}</p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-red-400 active:scale-95"
            >
              Eliminar
            </button>
          </div>

          <label className="block text-xs text-gray-500 mb-1">Plataforma</label>
          <select
            className={inputClass}
            value={acc.platform}
            onChange={(e) => update(index, 'platform', e.target.value)}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <label className="block text-xs text-gray-500 mb-1 mt-2">Email</label>
          <input
            className={inputClass}
            type="email"
            placeholder="email@admin.com"
            value={acc.email}
            onChange={(e) => update(index, 'email', e.target.value)}
          />

          <label className="block text-xs text-gray-500 mb-1 mt-2">Contraseña</label>
          <input
            className={inputClass}
            type="text"
            placeholder="contraseña"
            value={acc.password}
            onChange={(e) => update(index, 'password', e.target.value)}
          />

          {acc.platform === 'Dominio' && (
            <>
              <label className="block text-xs text-gray-500 mb-1 mt-2">URL del dominio</label>
              <input
                className={inputClass}
                type="text"
                placeholder="https://tudominio.com"
                value={acc.urlDomain}
                onChange={(e) => update(index, 'urlDomain', e.target.value)}
              />

              <label className="block text-xs text-gray-500 mb-1 mt-2">¿De dónde es el dominio?</label>
              <input
                className={inputClass}
                type="text"
                placeholder="Ej: Hostinger, NIC.ar, GoDaddy"
                value={acc.domainSource}
                onChange={(e) => update(index, 'domainSource', e.target.value)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  )
}