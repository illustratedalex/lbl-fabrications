type ContactBandProps = {
  title: string;
  body?: string | null;
  phone?: string | null;
  address?: string | null;
  serviceArea?: string | null;
};

export function ContactBand({ title, body, phone, address, serviceArea }: ContactBandProps) {
  return (
    <section className="contact-band">
      <div>
        <p className="site-eyebrow">Contact LBL</p>
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      <dl>
        {phone ? (
          <div>
            <dt>Phone</dt>
            <dd><a href={`tel:${phone.replace(/[^\d]/g, "")}`}>{phone}</a></dd>
          </div>
        ) : null}
        {address ? (
          <div>
            <dt>Address</dt>
            <dd>{address}</dd>
          </div>
        ) : null}
        {serviceArea ? (
          <div>
            <dt>Service area</dt>
            <dd>{serviceArea}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
