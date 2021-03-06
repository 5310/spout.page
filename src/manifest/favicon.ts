export const template = (paper: string, ink: string) => `
<svg width="100" height="101" fill="none" xmlns="http://www.w3.org/2000/svg" style=>
    <style>
    .paper { fill: ${paper}; }
    .ink { fill: ${ink}; }
    </style>
    <g clip-path="url(#clip0)">
        <path d="M0 .785h100v100H0v-100z" fill="#fff" class="paper"/>
        <g clip-path="url(#clip1)" fill="black" class="ink">
            <path d="M53.781 34.99c-.033.509-.374.624-.716.74-7.448 1.524-16.55-1.97-19.9-7.63-2.005-3.332-2.585-7.3-1.24-10.859 3.006-7.155 10.73-8.148 16.098-4.13 5.516 4.13 4.353 11.682-.206 15.933-.69.643-.794 1.03-.273 1.79 1.492 2.16 3.603 3.554 6.237 4.156zM73.337 70.03c.69-.176.761-.676.832-1.175.168-10.636-6.444-21.25-15.093-24.39-5.447-2.294-10.2-2.347-15.335 1.545-5.136 3.892-8.164 13.6-2.006 19.955 6.587 6.925 16.995 5.65 21.882-2.596.706-1.115 1.21-1.358 2.39-.838 3.357 1.492 5.82 4.034 7.33 7.5z"/>
            <circle cx="19.634" cy="43.648" r="13.164" transform="rotate(15 19.634 43.648)"/>
            <circle cx="16.011" cy="14.397" r="8.427" transform="rotate(15 16.011 14.397)"/>
        </g>
    </g>
</svg>
`

export const setFavicon = (paper: string, ink: string) => {
  const $favicon = self.document.querySelector(`head > link[rel='icon']`) as HTMLElement
  $favicon.setAttribute(`href`, `data:image/svg+xml,${template(paper, ink)}`)
}

export default setFavicon