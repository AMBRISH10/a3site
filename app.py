"""
FDA Drug Lookup Script
Uses the openFDA API to retrieve comprehensive drug information.
Usage: python fda_drug_lookup.py <drug_name>
Example: python fda_drug_lookup.py acyclovir
"""

import sys
import json
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime


BASE_URL = "https://api.fda.gov"


# ── Helpers ────────────────────────────────────────────────────────────────────

def fetch_json(url: str) -> dict | None:
    """Fetch JSON from a URL; return None on any error."""
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        print(f"  [HTTP {e.code}] {url}")
        return None
    except Exception as exc:
        print(f"  [Error] {exc}")
        return None


def safe(value, fallback="N/A"):
    """Return value if truthy, otherwise fallback string."""
    if isinstance(value, list):
        return ", ".join(str(v) for v in value) if value else fallback
    return str(value) if value not in (None, "", []) else fallback


def format_date(raw: str) -> str:
    """Convert YYYYMMDD → MM/DD/YYYY."""
    try:
        return datetime.strptime(raw, "%Y%m%d").strftime("%m/%d/%Y")
    except Exception:
        return raw


def section_header(title: str):
    width = 70
    print("\n" + "=" * width)
    print(f"  {title}")
    print("=" * width)


def field(label: str, value, indent: int = 2):
    pad = " " * indent
    print(f"{pad}{label:<30} {safe(value)}")


# ── FDA API calls ──────────────────────────────────────────────────────────────

def get_drug_applications(drug_name: str) -> list[dict]:
    """Query /drug/drugsfda for application records."""
    query = urllib.parse.quote(f'"{drug_name}"')
    url = (
        f"{BASE_URL}/drug/drugsfda.json"
        f"?search=openfda.generic_name:{query}"
        f"&limit=10"
    )
    data = fetch_json(url)
    if data and "results" in data:
        return data["results"]

    # Fallback: search by brand name
    url2 = (
        f"{BASE_URL}/drug/drugsfda.json"
        f"?search=openfda.brand_name:{query}"
        f"&limit=10"
    )
    data2 = fetch_json(url2)
    return data2.get("results", []) if data2 else []


def get_ndc_packages(drug_name: str) -> list[dict]:
    """Query /drug/ndc for NDC package codes."""
    query = urllib.parse.quote(drug_name)
    url = (
        f"{BASE_URL}/drug/ndc.json"
        f"?search=generic_name:{query}"
        f"&limit=20"
    )
    data = fetch_json(url)
    if data and "results" in data:
        return data["results"]

    url2 = (
        f"{BASE_URL}/drug/ndc.json"
        f"?search=brand_name:{query}"
        f"&limit=20"
    )
    data2 = fetch_json(url2)
    return data2.get("results", []) if data2 else []


def get_label_info(drug_name: str) -> dict | None:
    """Query /drug/label for PIL / MDD (max daily dose) info."""
    query = urllib.parse.quote(drug_name)
    url = (
        f"{BASE_URL}/drug/label.json"
        f"?search=openfda.generic_name:{query}"
        f"&limit=1"
    )
    data = fetch_json(url)
    if data and "results" in data and data["results"]:
        return data["results"][0]
    return None


# ── Display functions ──────────────────────────────────────────────────────────

def display_application(app: dict, index: int):
    """Print one drugsfda application record."""
    openfda = app.get("openfda", {})
    products = app.get("products", [])
    submissions = app.get("submissions", [])

    section_header(f"Application #{index}  —  {app.get('application_number', 'N/A')}")

    # Core identifiers
    field("Application Number:", app.get("application_number"))
    field("Sponsor / Applicant:", app.get("sponsor_name"))
    field("Application Type:", app.get("application_type", app.get("application_number", "N/A")[:3]))

    # openFDA enriched fields
    field("Active Ingredient(s):", openfda.get("substance_name"))
    field("Drug Name (Generic):", openfda.get("generic_name"))
    field("Drug Name (Brand):", openfda.get("brand_name"))
    field("Manufacturer:", openfda.get("manufacturer_name"))

    # Products (dosage form / route / strength / TE code / marketing status)
    if products:
        print(f"\n  {'─'*66}")
        print(f"  Products / Presentations ({len(products)} found):")
        print(f"  {'─'*66}")
        for i, prod in enumerate(products, 1):
            print(f"\n  Product {i}:")
            field("  Drug Name:", prod.get("brand_name") or openfda.get("generic_name"))
            field("  Dosage Form:", prod.get("dosage_form"))
            field("  Route:", prod.get("route"))
            field("  Strength:", prod.get("active_ingredients",
                  [{"strength": "N/A"}])[0].get("strength") if prod.get("active_ingredients") else "N/A")

            # Marketing status
            ms = prod.get("marketing_status", "N/A")
            field("  Marketing Status:", ms)

            # TE Code (therapeutic equivalence)
            te = prod.get("te_code", "N/A")
            field("  TE Code:", te)

            # Therapeutic Equivalent note
            if te and te != "N/A":
                te_meaning = interpret_te_code(te)
                field("  TE Meaning:", te_meaning)

    # Approval / submission history
    if submissions:
        print(f"\n  {'─'*66}")
        print(f"  Submission History:")
        print(f"  {'─'*66}")
        # Sort by date descending
        sorted_subs = sorted(
            submissions,
            key=lambda s: s.get("submission_status_date", "00000000"),
            reverse=True,
        )
        for sub in sorted_subs[:5]:          # show last 5
            sub_type   = sub.get("submission_type", "")
            sub_num    = sub.get("submission_number", "")
            status     = sub.get("submission_status", "")
            status_date = format_date(sub.get("submission_status_date", ""))
            review_pri = sub.get("review_priority", "")
            print(
                f"    [{sub_type}-{sub_num}]  Status: {status:<12}"
                f"  Date: {status_date:<12}  Priority: {review_pri or 'N/A'}"
            )

        # Best approval date
        approvals = [
            s for s in submissions
            if s.get("submission_status", "").upper() == "AP"
        ]
        if approvals:
            latest_ap = max(approvals, key=lambda s: s.get("submission_status_date", "0"))
            field("\n  Approval Date:", format_date(latest_ap.get("submission_status_date", "")))


def interpret_te_code(code: str) -> str:
    """Return human-readable description for common TE codes."""
    descriptions = {
        "AA": "Therapeutically Equivalent (no bioequivalence issues)",
        "AB": "Therapeutically Equivalent (meets bioequivalence requirements)",
        "AN": "Therapeutically Equivalent (solution/powder for aerosolization)",
        "AO": "Therapeutically Equivalent (injectable oil solutions)",
        "AP": "Therapeutically Equivalent (injectable aqueous solutions)",
        "AT": "Therapeutically Equivalent (topical)",
        "BC": "NOT Equivalent (controlled-release formulation issues)",
        "BD": "NOT Equivalent (active ingredient documented problems)",
        "BE": "NOT Equivalent (delayed-release oral dosage forms)",
        "BN": "NOT Equivalent (aerosol-nebulizer drug products)",
        "BP": "NOT Equivalent (active ingredient potential problems)",
        "BR": "NOT Equivalent (suppositories/enemas; may differ)",
        "BS": "NOT Equivalent (drug standard deficiencies)",
        "BT": "NOT Equivalent (topical; bioequivalence issues)",
        "BX": "NOT Equivalent (insufficient data)",
        "B*": "NOT Equivalent (pending resolution)",
    }
    return descriptions.get(code[:2].upper(), f"Code: {code}")


def display_ndc_packages(records: list[dict]):
    """Print NDC package codes."""
    section_header("NDC Package Codes")
    if not records:
        print("  No NDC records found.")
        return

    seen_ndc = set()
    count = 0
    for rec in records:
        packages = rec.get("packaging", [])
        generic  = safe(rec.get("generic_name"))
        brand    = safe(rec.get("brand_name"))
        dosage   = safe(rec.get("dosage_form"))
        route    = safe(rec.get("route"))
        labeler  = safe(rec.get("labeler_name"))

        for pkg in packages:
            ndc = pkg.get("package_ndc", "")
            if ndc in seen_ndc:
                continue
            seen_ndc.add(ndc)
            count += 1
            if count > 30:          # cap output
                print(f"  ... (showing first 30 of {len(seen_ndc)}+ records)")
                return
            print(
                f"  NDC: {ndc:<15}  {generic:<20}  {brand:<20}"
                f"  {dosage:<20}  Route: {route:<15}  Labeler: {labeler}"
            )


def display_label_info(label: dict | None):
    """Print MDD and PIL information from label data."""
    section_header("Label Information (MDD / PIL)")
    if not label:
        print("  No label data found.")
        return

    openfda = label.get("openfda", {})
    field("Generic Name:", openfda.get("generic_name"))
    field("Brand Name:", openfda.get("brand_name"))
    field("Manufacturer:", openfda.get("manufacturer_name"))

    # Maximum Daily Dose (MDD) — pulled from dosage sections
    mdd_fields = [
        ("dosage_and_administration", "Dosage & Administration"),
        ("dosage_and_administration_table", "Dosage Table"),
        ("maximum_dose_quantity", "Maximum Dose Quantity"),
    ]
    print()
    for key, label_name in mdd_fields:
        value = label.get(key)
        if value:
            text = value[0] if isinstance(value, list) else value
            # Truncate to 400 chars for readability
            truncated = text[:400].replace("\n", " ").strip()
            print(f"  [{label_name}]")
            print(f"    {truncated}{'...' if len(text) > 400 else ''}")
            print()

    # PIL / Patient Information
    pil_fields = [
        ("patient_medication_information", "Patient Medication Information (PIL)"),
        ("information_for_patients", "Information for Patients"),
        ("spl_patient_package_insert", "Patient Package Insert"),
    ]
    for key, label_name in pil_fields:
        value = label.get(key)
        if value:
            text = value[0] if isinstance(value, list) else value
            truncated = text[:600].replace("\n", " ").strip()
            print(f"  [{label_name}]")
            print(f"    {truncated}{'...' if len(text) > 600 else ''}")
            print()


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python fda_drug_lookup.py <drug_name>")
        print("Example: python fda_drug_lookup.py acyclovir")
        sys.exit(1)

    drug_name = " ".join(sys.argv[1:]).strip()

    print("\n" + "█" * 70)
    print(f"  FDA Drug Lookup  —  Query: '{drug_name}'")
    print("█" * 70)

    # 1. Drug application data (NDA / ANDA)
    print(f"\n[1/3] Fetching drug application records from openFDA …")
    applications = get_drug_applications(drug_name)

    if not applications:
        print(f"  ⚠  No application records found for '{drug_name}'.")
        print("  Try spelling variations or the brand name.")
    else:
        print(f"  ✓  Found {len(applications)} application(s).\n")
        for idx, app in enumerate(applications, 1):
            display_application(app, idx)

    # 2. NDC package codes
    print(f"\n[2/3] Fetching NDC package codes …")
    ndc_records = get_ndc_packages(drug_name)
    print(f"  ✓  Found {len(ndc_records)} NDC record(s).")
    display_ndc_packages(ndc_records)

    # 3. Label data (MDD / PIL)
    print(f"\n[3/3] Fetching label / PIL / MDD data …")
    label_data = get_label_info(drug_name)
    if label_data:
        print("  ✓  Label data found.")
    else:
        print("  ⚠  No label data found.")
    display_label_info(label_data)

    print("\n" + "=" * 70)
    print("  Data sourced from openFDA  —  https://open.fda.gov")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()