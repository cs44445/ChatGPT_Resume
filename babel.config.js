module.exports = {
  presets: [
    ['@vue/app',
     { useBuiltIns: 'entry' }]
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "marked",
        libraryDiretory:"es"
      }
    ]
  ]
}
