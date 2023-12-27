const workflow: Object = {
  "target_id": "my-company-id",
  "workflow": {
    "type": "workflow",
    "id": "root",
    "children": [
      {
        "access": 333,
        "type": "template_job_info",
        "id": "template_info",
        "job_title": "ACT_OBJET",
        "job_reference": "ACT_NUMERO",
        "job_address": "PCF_RUE",
        "label": "Résumé de la mission",
        "performer_estimation": 60,
        "files": [
  
        ],
        "children": [
          {
            "type": "section",
            "id": "template_section",
            "label": "Section",
            "access": 311,
            "direction": "col",
            "children": [
              {
                "type": "widget_text",
                "id": "template_client",
                "label": "Raison sociale",
                "access": 133,
                "data_type": "string",
                "data": "PCF_RS"
              },
              {
                "type": "widget_text",
                "id": "template_contact",
                "label": "Contact",
                "access": 133,
                "data_type": "string",
                "data": "CCT_EMAIL"
              },
              {
                "type": "widget_text",
                "id": "template_phone",
                "label": "Numéro de téléphone",
                "access": 133,
                "data_type": "phone",
                "data": "CCT_TELM"
              },
              {
                "type": "widget_text",
                "id": "template_type",
                "label": "Code Type d'intervention",
                "access": 133,
                "data_type": "string",
                "data": "ACT_TYPE"
              }
            ]
          }
        ]
      },
      {
        "type": "template_blank",
        "id": "template_blank",
        "label": "Vierge",
        "access": 333,
        "generate_documents": [
  
        ],
        "children": [
          {
            "type": "section",
            "id": "4f40bdb1-43c8-4027-bca0-4952fdb186be",
            "access": 111,
            "direction": "col",
            "children": [
              {
                "type": "widget_text",
                "id": "template_other_info",
                "label": "Autres informations",
                "access": 333,
                "data_type": "text",
                "data": "ACT_DESC"
              }
            ]
          }
        ]
      },
      
      {
        "type": "template_photo",
        "id": "template_photo",
        "label": "Photos",
        "access": 331,
        "generate_documents": [
  
        ],
        "photo_count": 1,
        "photos": [
          {
            "type": "widget_photo",
            "id": "template_photo_1",
            "access": 331,
            "data_type": "image",
            "instruction": "instructions sur la photo à prendre"
            
          }
        ],
        "annotation_tips": "Commentaire suggestion photo"
      },
      {
        "type": "template_signature",
        "id": "template_signature",
        "label": "Signature",
        "access": 333,
        "generate_documents": [
  
        ],
        "signature": [
  
        ],
        "terms": "Conditions Générales d'Utilisation"
      },
      {
        "type": "template_navigation",
        "id": "template_navigation",
        "label": "Navigation",
        "access": 333,
        "generate_documents": [],
        "city": "PCF_VILLE",
        "state": "IDF",
        "country_code": "fr",
        "zip_code": "PCF_CP",
        "beneficiary_phone": "CCT_TELM",
        "address": "PCF_RUE",
        "details": "détails adress batiment 1 ..."
      },
      
    ]
  }
}

export default workflow;