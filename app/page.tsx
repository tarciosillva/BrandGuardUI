"use client"

import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>("")
  const [termsOfBrand, setTermsOfBrand] = useState<string[]>([])

  const [terms, setTerms] = useState<string>("")
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false)
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false)


  useEffect(() => {
    if (!terms) {
      return
    }
    let arrTerm = terms.split(',')
    setTermsOfBrand(arrTerm)
  }, [terms])

  const sendRequest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingRequest(true)
    const baseUrl = process.env.NEXT_PUBLIC_API || ''

    if (!baseUrl) {
      alert("NEXT_PUBLIC_API env not defined")
    }

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ termsOfBrand, email })
    };

    fetch(`${baseUrl}/search`, options)
      .then(response => {
        if (response.ok) {
          console.log(response)
          setLoadingRequest(false)
          setShowSuccessMessage(true)
        }
      })
      .catch(err => {
        console.error(err)
        setLoadingRequest(false)
      });
  }

  return (
    <main className="w-full grid justify-center p-24 gap-8">
      <div className="grid gap-2">
        <h1 className="text-4xl font-bold text-center">
          Descubra seus concorrentes
        </h1>
        <p className="text-xl text-center text-gray-500">
          Monitore o uso de seus termos de marca em anúncios do Google.
        </p>
      </div>

      <form method="post" onSubmit={sendRequest} className="w-full grid gap-8">
        <div className="grid">
          <label htmlFor="termOfBrand">
            Termos de marca
          </label>
          <textarea
            name="terms Of Brand"
            id="termOfBrand"
            placeholder="Digites os termos de marca separados por uma virgula"
            className="border border-gray-400 rounded-md mt-2 p-2"
            rows={5}
            required
            onChange={(e) => setTerms(e.target.value)}
          >
          </textarea>
        </div>

        <div className="w-full grid gap-2">
          <label htmlFor="email">
            Email corporativo
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="seu@email.com"
            className="border border-gray-400 p-2 rounded-md"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full bg-slate-950 rounded-md text-center flex justify-center text-white text-lg p-2 font-bold">
          {loadingRequest ? (
            <img src="/loading.svg" alt="a loading image" className="w-9 h-9" />
          ) : (
            <p className="p-1">Descobrir</p>
          )}
        </button>
      </form>

      <p className={`text-lg text-center text-gray-500 ${showSuccessMessage ? 'block' : 'hidden'}`}>
        Seu diagnóstico será enviado por e-mail. Obrigado!
      </p>
    </main>
  );
}
