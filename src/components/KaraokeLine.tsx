
type KaraokeLineProps = {
    children: string;
}

export const KaraokeLine = ({ children }: KaraokeLineProps) => {
    return (
        <p style={{fontSize: 30}}>
            {children}
        </p>
    )
}